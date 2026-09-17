# Hệ Thống Quản Lý Mỹ Phẩm

Hệ thống quản lý bán mỹ phẩm theo kiến trúc **microservices**:

- **Backend**: NestJS + MikroORM (PostgreSQL).
- **Frontend**: React 19 + Vite + Tailwind CSS.
- **Hạ tầng**: Docker Compose (PostgreSQL 16, Nginx proxy). Các service giao tiếp nội bộ bằng **orchestration (HTTP call)**.

## Cấu trúc thư mục

```
backend/                 # toàn bộ backend (monorepo NestJS)
  apps/
    gateway-service/     # API Gateway (cổng vào, Swagger tổng hợp)
    user-service/        # Người dùng
    authentication-service/  # Đăng nhập / token
    authorization-service/   # Vai trò (Role)
    department-service/  # Phòng ban
    employee-service/    # Nhân viên
    customer-service/    # Khách hàng
    category-service/    # Danh mục mỹ phẩm
    supplier-service/    # Nhà cung cấp
    cosmetic-service/    # Mỹ phẩm / biến thể
    inventory-service/   # Tồn kho / lô
    purchase-service/    # Phiếu nhập
    order-service/       # Đơn hàng
    invoice-service/     # Hóa đơn (công nợ)
    receipt-service/     # Thu chi (phiếu thu / phiếu chi)
    basket-service/      # Giỏ hàng
    storage-service/     # Upload file
frontend/                # React app
docker/                  # Scripts khởi tạo DB, migrations, cấu hình Nginx
sql/schema.sql           # Mô tả toàn bộ schema 13 database
db-exports/              # Bản dump database mẫu (optional)
docs/                    # Tài liệu kiến trúc
docker-compose.yaml      # Định nghĩa toàn bộ hệ thống
.env.example             # Mẫu biến môi trường
```

## Chức năng chính

- **Đăng nhập / phân quyền**: xác thực JWT, vai trò Admin/Employee/Customer, phân quyền theo **phòng ban** (`sales`, `warehouse`, `accounting`).
- **Danh mục**: khách hàng, nhân viên, phòng ban, nhà cung cấp, sản phẩm, danh mục mỹ phẩm.
- **Mua hàng**: phiếu nhập, chi tiết phiếu nhập, nhập kho theo lô, hoàn tất phiếu nhập và **tự động sinh phiếu chi**.
- **Bán hàng**: POS tạo hóa đơn, chi tiết đơn hàng, hóa đơn & **công nợ**.
- **Kho**: tồn kho theo lô, điều chỉnh kho, lịch sử điều chỉnh.
- **Thu chi** (`receipt-service`): **phiếu thu** và **phiếu chi**.
  - Phiếu thu: nhập thủ công hoặc **tự động sinh khi khách thanh toán hóa đơn** (ghi nhận công nợ).
  - Phiếu chi: nhập thủ công (phân loại `supplier`, `salary`, `infrastructure`, `material`, `other`) hoặc **tự động sinh khi hoàn tất phiếu nhập**.
- **Báo cáo**: doanh thu, tồn kho, tổng quan.

## Yêu cầu

| Công cụ | Phiên bản                                                                 |
| ------- | ------------------------------------------------------------------------- |
| Docker  | 20.10+ (có Docker Compose v2)                                             |
| Node.js | 26 trở lên (chỉ cần khi phát triển local, không bắt buộc khi dùng Docker) |

## Chạy nhanh bằng Docker Compose

1. Tạo file biến môi trường từ mẫu:

   ```bash
   cp .env.example .env
   ```

2. Điền đầy đủ giá trị trong `.env`:
   - `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` — tài khoản superuser của PostgreSQL.
   - Các nhóm `*_DB_USER` / `*_DB_PASSWORD` / `*_DB_NAME` — tài khoản riêng cho từng service.
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — chuỗi bí mật bất kỳ (nên dùng chuỗi dài, ngẫu nhiên).
   - Các `*_SERVICE_URL` đã có giá trị mặc định, giữ nguyên nếu chạy bằng Compose.

3. Build image backend (lần đầu mất vài phút):

   ```bash
   docker compose build
   ```

   > Toàn bộ các service backend dùng chung **một** image `cosmetic-management-system-backend`.

4. Khởi động toàn bộ hệ thống:

   ```bash
   docker compose up -d
   ```

   Luồng khởi động được tự động hóa:
   - `postgres` khởi tạo 15 user/database theo `.env`.
   - `sync-users` đồng bộ quyền (GRANT) giữa các database.
   - `migration` chạy MikroORM migrations cho từng service.
   - Các service backend + `gateway-service` + `frontend` + `nginx` lần lượt đi lên.

5. Kiểm tra trạng thái:

   ```bash
   docker compose ps
   ```

## Chạy lại & vận hành

```bash
docker compose up -d          # khởi động lại toàn bộ
docker compose down           # tắt toàn bộ (giữ data)
docker compose down -v        # tắt và xóa sạch volume (data reset về 0)
docker compose logs -f        # xem log tất cả service
docker compose logs -f cosmetic-service   # xem log 1 service
```

### Rebuild sau khi sửa code

- **Sửa backend**:

  ```bash
  docker compose build --no-cache backend
  docker compose up -d --force-recreate <tên-service>
  ```

  Ví dụ: `docker compose up -d --force-recreate cosmetic-service`.

- **Sửa frontend**:

  ```bash
  docker compose build frontend
  docker compose up -d --force-recreate frontend nginx
  ```

## Truy cập hệ thống

| Mục                 | Địa chỉ                                    |
| ------------------- | ------------------------------------------ |
| Ứng dụng web        | http://localhost/                          |
| API Gateway         | http://localhost:3000                      |
| Swagger API         | http://localhost:3000/api/docs             |
| PostgreSQL          | `localhost:5432`                           |

Các service backend cũng được expose trực tiếp trên cổng riêng (3001–3016), tuy nhiên mọi luồng chuẩn nên đi qua Gateway (`/api/...` trên cổng 3000 hoặc 80).

## Phát triển local (dev mode)

Chạy riêng frontend bằng Vite (hot reload):

```bash
cd frontend
npm install
npm run dev        # mặc định http://localhost:5173, proxy mặc định /api -> backend
```

Base URL API có thể ghi đè bằng biến `VITE_API_URL` (mặc định `/api`).

Chạy backend riêng từng service (cần PostgreSQL đã chạy):

```bash
cd backend
npm install
npm run start:dev:user      # chạy user-service --watch
npm run start:dev:auth      # chạy authentication-service --watch
npm run db:up               # chỉ khởi động postgres
```

> Khi chạy backend ngoài Docker, nhớ sửa các biến `*_DB_HOST` / `*_SERVICE_URL` trong `.env` thành giá trị truy cập được từ host (ví dụ `localhost`).

## Database & migrations

- Mỗi service có database riêng với schema do MikroORM migrations quản lý:

  ```
  backend/apps/<service>/src/infrastructure/entities/   # entity
  backend/apps/<service>/migrations/                     # file migration
  backend/apps/<service>/mikro-orm.config.ts             # cấu hình
  ```

- Migrations chạy tự động khi khởi động Compose (service `migration`). Muốn chạy lại thủ công:

  ```bash
  docker compose run --rm migration
  ```

- Tài liệu mô tả toàn bộ schema 13 database: `sql/schema.sql`.

## Kiểm tra chất lượng code (local)

```bash
# Backend
cd backend
npm run lint                  # ESLint + autofix
npx tsc -p apps/<service>/tsconfig.app.json --noEmit   # typecheck từng service
npm run test                  # Jest

# Frontend
cd frontend
npm run lint                  # oxlint
npx tsc -b --noEmit           # typecheck
npm run build                 # build thử

# Docker
docker compose config         # validate docker-compose.yaml
```
