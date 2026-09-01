# Hướng dẫn thêm một service mới

Tài liệu này mô tả toàn bộ các bước để thêm một service backend mới (ví dụ:
`department-service`) vào hệ thống: từ lúc sinh code, cấp phát database, viết
migration, đến khi chạy được trong Docker Compose.

## Kiến trúc tổng quan

```
browser ──> nginx (:80) ──> gateway-service (:3000) ──> <các service nghiệp vụ>
                                                              │
                                            cosmetic-postgres (mỗi service 1 DB riêng)
```

- **nginx**: chỉ proxy `/api/*` về gateway và còn lại về frontend → **không cần
  sửa khi thêm service**.
- **gateway-service**: định tuyến theo path (`/api/users`, `/api/roles`, ...) tới
  từng service qua biến `<SVC>_SERVICE_URL`.
- **postgres**: 1 container duy nhất chứa nhiều database, mỗi service có user +
  database riêng. User/DB được tạo bởi `docker/postgres/init-dbs.sh`, vốn đọc
  toàn bộ tên/password từ biến môi trường `<SVC>_DB_*` (do `docker-compose.yaml`
  inject từ `.env`), không hardcode.

## Checklist nhanh

| # | Việc cần làm | File |
|---|--------------|------|
| 1 | Sinh app NestJS + khai báo port | `backend/apps/<svc>-service`, `backend/constants/ports.ts`, `backend/nest-cli.json` |
| 2 | Khai báo biến môi trường | `.env`, block `environment` của `postgres` trong `docker-compose.yaml` |
| 3 | Cấp phát user + database (env-driven) | `docker/postgres/init-dbs.sh` |
| 4 | Tạo entity + cấu hình MikroORM | `src/infrastructure/entities/*.entity.ts`, `mikro-orm.config.ts` |
| 5 | Sinh migration | `apps/<svc>-service/migrations/` |
| 6 | Thêm service vào Docker Compose | `docker-compose.yaml` |
| 7 | Định tuyến + docs ở gateway | `backend/apps/gateway-service/src/main.ts` |

Chi tiết từng bước bên dưới, lấy ví dụ thực tế là `department-service`.

---

## Bước 1: Sinh app NestJS trong monorepo

```bash
cd backend
npx nest g app <svc>-service
```

Lệnh này tự tạo `apps/<svc>-service/`, `tsconfig.app.json` và đăng ký project
trong `nest-cli.json`.

Sau đó thêm cổng của service vào `backend/constants/ports.ts`:

```ts
export const DEPARTMENT_SERVICE_PORT = 3004;
```

Và sửa `main.ts` để có global prefix `/api`, listen đúng cổng và bật Swagger UI
dùng thử API (mỗi service tự host docs của mình ở `/api/docs`):

```ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(DepartmentServiceModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Department Service API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(DEPARTMENT_SERVICE_PORT);
}
```

## Bước 2: Khai báo biến môi trường

Thêm vào `.env`, đặt tên theo quy tắc `<SVC>_DB_*`:

```env
DEPARTMENT_DB_HOST=postgres          # "postgres" = tên service trong compose
DEPARTMENT_DB_PORT=5432
DEPARTMENT_DB_USER=cosmetic_department
DEPARTMENT_DB_PASSWORD=...
DEPARTMENT_DB_NAME=cosmetic_department_service

DEPARTMENT_SERVICE_URL=http://department-service:3004
```

> Lưu ý: các URL/host trong `.env` là hostname **bên trong network Docker**
> (tên service). Khi chạy lệnh trực tiếp trên máy host phải override
> `DEPARTMENT_DB_HOST=localhost` (xem Bước 5).

Sau đó, để `init-dbs.sh` (Bước 3) nhìn thấy các biến này, phải **khai báo thêm
chúng vào block `environment` của service `postgres`** trong
`docker-compose.yaml`. Mỗi service cần 3 biến `_DB_USER`, `_DB_PASSWORD`,
`_DB_NAME`:

```yaml
  postgres:
    environment:
      # ... các biến đã có ...
      DEPARTMENT_DB_USER: ${DEPARTMENT_DB_USER}
      DEPARTMENT_DB_PASSWORD: ${DEPARTMENT_DB_PASSWORD}
      DEPARTMENT_DB_NAME: ${DEPARTMENT_DB_NAME}
```

## Bước 3: Cấp phát user + database (`init-dbs.sh`)

Script `docker/postgres/init-dbs.sh` được mount vào
`/docker-entrypoint-initdb.d/` của container postgres — nó **chỉ chạy đúng một
lần khi volume `postgres-data` còn trống**. Vì thế toàn bộ tên user/database/
password trong script lấy từ **biến môi trường** (do `docker-compose.yaml` inject
từ `.env`), **không hardcode**.

> Quan trọng: `init-dbs.sh` nhận các biến `<SVC>_DB_USER`, `<SVC>_DB_PASSWORD`,
> `<SVC>_DB_NAME` qua block `environment` của container `postgres` trong
> `docker-compose.yaml`. Nếu bạn thêm service mới, nhớ thêm đủ 3 biến đó vào
> **cả** `.env` lẫn block `environment` của service `postgres`.

Superuser của PostgreSQL container lấy từ `POSTGRES_USER` trong `.env`
(vd: `cosmetic_admin`), **không phải** `postgres`. Check bằng
`grep POSTGRES_USER .env`.

**Thêm service mới ở đâu:** trong `docker/postgres/init-dbs.sh`, thêm service
vào 3 chỗ, tất cả đều dùng biến `<SVC>_DB_*`:

1. Khối `CREATE USER ${SVC_DB_USER} ...` (tạo role cho service)
2. Khối `SELECT 'CREATE DATABASE ...' WHERE NOT EXISTS ... \gexec` (tạo database
   nếu chưa tồn tại — **idempotent**, không lỗi khi DB đã có)
3. Các dòng `"...:$SVC_DB_NAME:$SVC_DB_USER"` trong vòng lặp grant database và
   lời gọi `grant_schema_privileges "$SVC_DB_NAME" "$SVC_DB_USER"`

Script dùng biến nên tên/password lấy thẳng từ `.env`, không phải sửa tay.

### Nếu volume đã tồn tại (script sẽ KHÔNG chạy lại)

`init-dbs.sh` chỉ chạy khi volume trống. Nếu volume đã có dữ liệu, phải tạo tay
trong container đang chạy. Lấy `POSTGRES_USER` và password từ `.env` ở thư mục
gốc repo:

```bash
# Đọc .env (chạy từ thư mục gốc repo)
export $(grep -v '^#' .env | xargs)

# Tạo user + database (thay DEPARTMENT_ bằng tiền tố service của bạn)
docker exec cosmetic-postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -c "CREATE USER $DEPARTMENT_DB_USER WITH PASSWORD '$DEPARTMENT_DB_PASSWORD';" \
  -c "CREATE DATABASE $DEPARTMENT_DB_NAME OWNER $DEPARTMENT_DB_USER;" \
  -c "GRANT ALL PRIVILEGES ON DATABASE $DEPARTMENT_DB_NAME TO $DEPARTMENT_DB_USER;"

docker exec cosmetic-postgres psql -U "$POSTGRES_USER" -d "$DEPARTMENT_DB_NAME" \
  -c "ALTER SCHEMA public OWNER TO $DEPARTMENT_DB_USER;
      GRANT ALL ON SCHEMA public TO $DEPARTMENT_DB_USER;"
```

> Lưu ý: `POSTGRES_USER` là superuser của PostgreSQL container (vd: `cosmetic_admin`),
> **không phải** `postgres`. Check giá trị bằng `grep POSTGRES_USER .env`.
> Nếu lỗi `role "postgres" does not exist` nghĩa là dùng sai tên.

### Verify user/DB đã tồn tại

```bash
docker exec cosmetic-postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  -c "\du"          # danh sách users
  -c "\l"           # danh sách databases
```

(Chạy từ thư mục gốc repo. Muốn test script sạch hoàn toàn thì
`docker compose down -v` nhưng sẽ **mất toàn bộ dữ liệu**.)

## Bước 4: Entity + cấu hình MikroORM

Tạo entity theo mẫu `user.entity.ts`:

```ts
// apps/<svc>-service/src/infrastructure/entities/<name>.entity.ts
import { OptionalProps } from '@mikro-orm/core';
import { defineEntity, p } from '@mikro-orm/postgresql';

const DepartmentSchema = defineEntity({
  name: 'Department',
  tableName: 'departments',
  properties: {
    id: p.uuid().primary().defaultRaw('gen_random_uuid()'),
    name: p.string().unique(),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p.datetime().onCreate(() => new Date()).onUpdate(() => new Date()),
  },
});

export class Department extends DepartmentSchema.class {
  [OptionalProps]?: 'createdAt' | 'updatedAt';
}

DepartmentSchema.setClass(Department);
```

Đăng ký vào `apps/<svc>-service/mikro-orm.config.ts`:

```ts
export default defineConfig({
  host: process.env.DEPARTMENT_DB_HOST,
  ...
  entities: [Department],        // ← bắt buộc, mảng rỗng sẽ lỗi "No entities found"
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
});
```

## Bước 5: Sinh và chạy migration

Chạy **từ thư mục `backend/`**, override host về `localhost` vì lệnh chạy trên
máy host chứ không phải trong Docker:

```bash
cd backend

# sinh file migration (diff schema entity <-> DB)
DEPARTMENT_DB_HOST=localhost npx mikro-orm migration:create \
  --config apps/department-service/mikro-orm.config.ts --initial

# chạy thử migration lên DB local (chính là container postgres :5432)
DEPARTMENT_DB_HOST=localhost npx mikro-orm migration:up \
  --config apps/department-service/mikro-orm.config.ts
```

File migration nằm ở `apps/<svc>-service/migrations/Migration*.ts` — **commit
luôn** lên git. Container `migration-<svc>` sẽ tự chạy `migration:up` khi
`docker compose up`; migration đã áp dụng thì được bỏ qua (ghi nhận trong bảng
`mikro_orm_migrations`).

Các lệnh hay dùng:

| Lệnh | Tác dụng |
|------|----------|
| `migration:create` | Diff entity ↔ DB thành file migration mới |
| `migration:up` | Chạy các migration chưa áp dụng |
| `migration:down` | Rollback migration gần nhất |
| `migration:create -b` | Tạo migration rỗng (tự viết SQL) |

## Bước 6: Thêm vào `docker-compose.yaml`

Mỗi service có **2 service compose**: job migration (chạy xong thì thoát) và
service chính (phụ thuộc migration phải thành công):

```yaml
  migration-department:
    build: ./backend
    command: sh -c "npx mikro-orm migration:up"
    environment:
      NODE_OPTIONS: "-r ts-node/register"
      MIKRO_ORM_CLI_CONFIG: "./apps/department-service/mikro-orm.config.ts"
      DEPARTMENT_DB_HOST: ${DEPARTMENT_DB_HOST}
      # ... các biến DEPARTMENT_DB_* còn lại
    depends_on:
      sync-users:
        condition: service_completed_successfully

  department-service:
    build: ./backend
    command: ["node", "dist/apps/department-service/main.js"]
    environment:
      DEPARTMENT_DB_HOST: ${DEPARTMENT_DB_HOST}
      # ... các biến DEPARTMENT_DB_* còn lại
      JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET}
    ports:
      - "3004:3004"
    depends_on:
      migration-department:
        condition: service_completed_successfully
```

Cuối cùng thêm biến cho gateway (xem Bước 7):

```yaml
  gateway-service:
    environment:
      DEPARTMENT_SERVICE_URL: ${DEPARTMENT_SERVICE_URL}
```

## Bước 7: Định tuyến ở gateway

Trong `backend/apps/gateway-service/src/main.ts`, thêm proxy middleware theo
path prefix của service mới:

```ts
app.use(
  createProxyMiddleware({
    target: process.env.DEPARTMENT_SERVICE_URL,
    changeOrigin: true,
    pathFilter: (pathname) => /^\/api\/departments(\/|$)/.test(pathname),
  }),
);
```

Cuối cùng thêm service vào mảng `SERVICE_DOCS_SOURCES` trong cùng file
`gateway-service/src/main.ts` để API của nó xuất hiện trên trang docs chung
`localhost:3000/api/docs`.

---

## Troubleshooting

### `getaddrinfo ENOTFOUND postgres`

Hostname `postgres` chỉ tồn tại **bên trong network Docker**. Lỗi này xuất hiện
khi chạy lệnh mikro-orm trên máy host. Fix: thêm prefix env khi chạy lệnh:

```bash
DEPARTMENT_DB_HOST=localhost npx mikro-orm ...
```

⚠️ Nhớ override đúng biến **HOST**, đừng nhầm sang `_DB_PORT`.

### `Error: No entities found, please use 'entities' option`

Config `mikro-orm.config.ts` có `entities: []`. Phải đăng ký ít nhất một entity
(Bước 4).

### `database "..." does not exist` / password authentication failed

DB/user chưa được tạo: xem Bước 3 — nhớ rằng `init-dbs.sh` chỉ chạy khi volume
postgres còn trống, nếu volume đã có dữ liệu phải tạo tay bằng lệnh `psql`.

### `role "postgres" does not exist`

Superuser của container không phải `postgres`. Dùng đúng tên từ `.env`:

```bash
grep POSTGRES_USER .env    # xd giá trị, vd: cosmetic_admin
```

Rồi dùng `-U cosmetic_admin` thay vì `-U postgres`.

### `service "migration-xxx" didn't complete successfully: exit 1`

Migration job lỗi → service chính bị giữ lại ở trạng thái *Created* vì
`depends_on: service_completed_successfully`. Xem log nguyên nhân:

```bash
docker compose logs migration-department
```

### Sửa `.env` / thêm biến mới mà container không thấy

Biến môi trường chỉ được inject lúc khởi tạo container, cần recreate:

```bash
docker compose up -d --force-recreate <service>
```
