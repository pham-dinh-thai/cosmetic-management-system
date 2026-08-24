# Kiến trúc và quy tắc code backend

Tài liệu mô tả cách tổ chức code backend và các quy ước bắt buộc khi viết code.
Ví dụ lấy từ `user-service` — service hoàn chỉnh nhất, mọi service mới phải
tuân theo cùng cấu trúc.

## 1. Tổng quan hệ thống

```
browser ──> nginx (:80) ──> gateway-service (:3000) ──> user-service (:3001)
                                                     ├─> authentication-service (:3002)
                                                     ├─> authorization-service (:3003)
                                                     └─> department-service (:3004)
```

- Mỗi service là 1 app NestJS độc lập trong monorepo (`backend/apps/`), build
  và chạy riêng bằng Docker Compose.
- **Mỗi service 1 database PostgreSQL riêng**. Không được query chéo sang DB
  của service khác; cần dữ liệu thì gọi HTTP endpoint `/internal` của service đó.
- `gateway-service` chỉ làm proxy theo path prefix, không chứa business logic.
- `nginx` chỉ rate-limit và điều hướng: `/api/*` → gateway, còn lại → frontend.

## 2. Cấu trúc thư mục monorepo

```
backend/
├── apps/                    # các service (1 thư mục = 1 service)
├── libs/                    # code dùng chung kiểu NestJS library
│   └── security/            # AuthGuard, RolesGuard, @Roles(), Role enum
├── constants/               # hằng số dùng chung (vd ports.ts)
└── nest-cli.json            # đăng ký project monorepo
```

Quy tắc:

- Chỉ được import chéo qua `libs/` hoặc `constants/`, không import trực tiếp
  `src/` của service này sang service khác.
- Cổng mỗi service khai báo trong `constants/ports.ts`.

## 3. Cấu trúc bên trong một service

Code chia thành 4 nhóm thư mục, mỗi nhóm có trách nhiệm riêng:

| Thư mục           | Trách nhiệm                              | Được phép import gì             |
| ----------------- | ---------------------------------------- | ------------------------------- |
| `presentation/`   | Nhận/trả HTTP: controller + DTO validate | application                     |
| `application/`    | Xử lý từng hành động (use case)          | domain                          |
| `domain/`         | Kiểu dữ liệu nghiệp vụ + business rule   | `@nestjs/common` (xem bên dưới) |
| `infrastructure/` | Chi tiết kỹ thuật: DB, UUID...           | domain, application             |

Chi tiết cây thư mục:

```
apps/user-service/src/
├── main.ts                          # bootstrap: prefix /api, listen port
├── user-service.module.ts           # đăng ký controller/provider/binding DI
├── presentation/
│   ├── public/users/                # API cho client (qua gateway): /api/users
│   │   ├── users.controller.ts
│   │   └── requests/create-user.request.ts
│   └── internal/users/              # API cho service khác: /api/users/internal/*
│       └── users.controller.ts
├── application/
│   ├── use-cases/
│   │   └── create-user/
│   │       ├── create-user.use-case.ts    # logic điều phối
│   │       ├── create-user.request.ts     # input type (interface)
│   │       └── create-user.response.ts    # output type
│   └── ports/
│       └── create-user-id.port.ts         # interface cho việc cần làm ngoài (vd sinh id)
├── domain/
│   ├── user.aggregate.ts            # class User: field private + getter + static create()
│   ├── repositories/
│   │   ├── users-command.repository.ts    # interface lưu/sửa/xoá
│   │   └── users-query.repository.ts      # interface đọc dữ liệu
│   ├── read-models/user.read-model.ts     # dạng dữ liệu trả ra khi query
│   ├── services/user-uniqueness.service.ts # rule nghiệp vụ dùng chung
│   ├── enums/gender.enum.ts
│   └── types.ts
└── infrastructure/
    ├── entities/user.entity.ts      # entity MikroORM (map bảng users)
    ├── repositories/mikro-users-{command,query}.repository.ts
    ├── mappers/users.mapper.ts      # chuyển đổi User (nghiệp vụ) ↔ entity (DB)
    └── adapters/create-user-uuid.adapter.ts
```

### Quy tắc hướng phụ thuộc

- Controller không tự gọi repository — luôn gọi use case.
- Use case và domain chỉ biết repository qua **interface**, không biết nó dùng
  MikroORM hay thứ gì khác. Implementation nằm ở `infrastructure/`.
- `domain/` và `application/` được phép import từ `@nestjs/common` — giới hạn
  trong: decorator DI (`@Injectable`, `@Inject`) và exception
  (`NotFoundException`, `ConflictException`...). Đây là phụ thuộc chấp nhận được
  vì Nest là framework nền của cả repo; đổi lại không phải viết lớp custom error
  riêng.
- Ngoại lệ trên, `domain/` và `application/` **không import** gì khác của kỹ
  thuật: cấm `@mikro-orm/*`, driver DB, HTTP client, config... Nếu sau này muốn
  tách hẳn business logic khỏi Nest thì chỉ cần thay exception bằng error type
  riêng + exception filter.

## 4. Quy ước từng phần

### 4.1. Domain

- Class nghiệp vụ (`user.aggregate.ts`): field để `private`, đọc qua getter,
  tạo object mới luôn qua `static create(props)` — nơi đặt validate/ràng buộc
  lúc khởi tạo.
- Repository: mặc định gộp chung một interface `I<Xxx>sRepository` chứa cả
  đọc lẫn ghi (xem `authorization-service`). Chỉ tách thành
  `I<Xxx>sCommandRepository` / `I<Xxx>sQueryRepository` khi nghiệp vụ thực sự
  phức tạp (vd như `user-service`).
- Interface đặt trong `domain/repositories/`, kèm token DI:

```ts
export interface IUsersCommandRepository {
  create(user: User): Promise<void>;
  delete(id: string): Promise<boolean>;
}

export const USERS_COMMAND_REPOSITORY = 'IUsersCommandRepository';
```

### 4.2. Application (use case)

- **1 hành động = 1 thư mục** trong `use-cases/<động-từ-tân-ngữ>/`, tối thiểu
  là file `.use-case.ts`. File `.request.ts` / `.response.ts` chỉ tạo khi
  input/output phức tạp (nhiều trường, cần tái sử dụng):
  - Response chỉ có 1-2 trường đơn giản (vd `{ id }`) → trả object literal
    ngay trong use case, khỏi tạo file.
  - Request chỉ là 1 tham số đơn lẻ (vd `id` từ path param) → nhận thẳng
    primitive, khỏi tạo interface.
- Use case là class `@Injectable()` với duy nhất phương thức `execute()`.
- Inject dependency qua `@Inject(TOKEN)` theo interface, ví dụ:

```ts
@Injectable()
export class CreateUserUseCase {
  public constructor(
    @Inject(USERS_COMMAND_REPOSITORY)
    private readonly usersCommandRepository: IUsersCommandRepository,
    @Inject(CREATE_USER_ID_PORT)
    private readonly createUserIdPort: ICreateUserIdPort,
  ) {}

  public async execute(
    request: ICreateUserRequest,
  ): Promise<CreateUserResponse> {
    await this.userUniquenessService.ensureEmailIsUnique(request.email); // rule
    const id = this.createUserIdPort.generate();
    const user = User.create({ ...request, id }); // tạo object nghiệp vụ
    await this.usersCommandRepository.create(user); // lưu
    return new CreateUserResponse(user.getId());
  }
}
```

- Rule nghiệp vụ (unique email, ràng buộc dữ liệu...) đặt trong `domain/`
  (method của class hoặc domain service); use case chỉ gọi theo trình tự.
- Khi vi phạm rule, use case/domain ném thẳng exception của Nest
  (`NotFoundException`, `ConflictException`...) — framework tự đổi thành HTTP
  status tương ứng.

### 4.3. Presentation

- Tách 2 loại controller:
  - `public/` — API cho frontend, path `/api/<resource>`.
  - `internal/` — API cho service khác gọi, path `/api/<resource>/internal/*`.
- Controller mỏng: nhận request → gọi use case → trả kết quả, không viết logic.
- DTO nằm trong `presentation/<loại>/<resource>/requests/`, dùng decorator
  `class-validator`, và `implements` interface request của use case:

```ts
export class CreateUserRequest implements ICreateUserRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  firstName!: string;
}
```

### 4.4. Infrastructure

- **Entity** (`entities/*.entity.ts`) dùng `defineEntity` + `p.*`; bảng đặt
  tên snake_case số nhiều (`users`, `departments`):

```ts
const UserSchema = defineEntity({
  name: "User",
  tableName: "users",
  properties: {
    id: p.uuid().primary().defaultRaw("gen_random_uuid()"),
    createdAt: p.datetime().onCreate(() => new Date()),
    updatedAt: p
      .datetime()
      .onCreate(() => new Date())
      .onUpdate(() => new Date()),
  },
});
```

- **Repository impl**: đặt tên `mikro-<xxx>s-{command,query}.repository.ts`,
  inject `EntityManager`, thao tác qua entity + mapper.
- **Mapper**: class static `toMikro(classNghiệpVu → entity)` và
  `toReadModel(entity → readModel)` — nơi duy nhất làm việc chuyển đổi này.
- **Adapter** (`adapters/*.adapter.ts`): implement các port của application,
  vd adapter sinh UUID.

### 4.5. Nối DI trong module

Mọi binding khai báo trong `<svc>-service.module.ts`:

```ts
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../.env', isGlobal: true }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({ ...dbOptions }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([User]),
  ],
  controllers: [UsersController, InternalUsersController],
  providers: [
    CreateUserUseCase,                       // use case
    UserUniquenessService,                   // domain service
    { provide: USERS_COMMAND_REPOSITORY, useClass: MikroUsersCommandRepository },
    { provide: CREATE_USER_ID_PORT, useClass: CreateUuidAdapter },
  ],
})
```

## 5. Luồng xử lý một request

```
POST /api/users
→ nginx (rate limit) → gateway (proxy /api/users/*)
→ UsersController          : validate DTO
→ CreateUserUseCase        : kiểm tra rule → tạo User → gọi repository
→ MikroUsersCommandRepository → UsersMapper.toMikro() → EntityManager.flush()
← CreateUserResponse { id }
```

Request đọc dữ liệu chạy tương tự nhưng qua query repository (nếu service tách
riêng) và trả read-model.

## 6. Code dùng chung

- `libs/security`: `AuthGuard`, `RolesGuard`, `@Roles(...)`, `Role` enum.
  Service cần auth thì import từ đây, không copy code.
- `constants/`: cổng service và hằng số chung khác.

## 7. Quy tắc đặt tên

| Đối tượng                   | Quy ước                         | Ví dụ                                                         |
| --------------------------- | ------------------------------- | ------------------------------------------------------------- |
| Thư mục use case            | kebab-case, động từ trước       | `create-user/`, `find-users/`                                 |
| File                        | kebab-case                      | `user.aggregate.ts`, `users.mapper.ts`                        |
| Class                       | PascalCase + hậu tố vai trò     | `CreateUserUseCase`, `InternalUsersController`, `UsersMapper` |
| Interface domain/repository | tiền tố `I`                     | `IUsersQueryRepository`                                       |
| Token DI                    | UPPER_SNAKE trùng tên interface | `USERS_QUERY_REPOSITORY`                                      |
| Bảng DB                     | snake_case số nhiều             | `users`, `departments`                                        |
| Cổng service                | `<SVC>_SERVICE_PORT`            | `DEPARTMENT_SERVICE_PORT`                                     |

## 8. Checklist khi thêm tính năng mới

1. `domain/`: class nghiệp vụ, enum/types nếu cần, interface repository (+token).
2. `application/`: thư mục use case (`.request.ts`/`.response.ts` chỉ khi cần),
   thêm port nếu có việc cần làm ngoài hệ thống.
3. `infrastructure/`: entity (đổi schema thì sinh migration — xem
   [adding-a-new-service.md](./adding-a-new-service.md)), repository impl,
   mapper, adapter.
4. `presentation/`: DTO + controller (public hoặc internal).
5. Module: đăng ký controller/provider/binding.
6. Test: file spec cạnh file tương ứng (`*.spec.ts`).
7. Endpoint mới cho client: cập nhật proxy route ở gateway-service.
