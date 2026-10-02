# Plan: hardening — chặn truy cập trái phép và bịt lỗ hổng đã kiểm chứng

Mọi mục dưới đây đã **chạy thật và đo được**, không phải suy đoán từ đọc code.
Lệnh khai thác nằm trong từng mục để tái lập.

## Số liệu nền

| hạng mục | số |
|---|---|
| service | 19 |
| tổng route HTTP | 174 |
| route nằm trong controller **không có guard nào** | 40 |
| internal controller (không xác thực) | 19 controller / 36 route |
| foreign key trong mỗi database | 2 |
| đơn hàng trỏ khách đã xoá | 5 |
| file test | 3 (đều là test mặc định của Nest scaffold) |

---

## P0-1. Internal endpoint không có xác thực, 5 route lọt ra public qua gateway

17 internal controller **không có guard, không kiểm tra header, không secret nào** —
ai cũng gọi được. Tệ hơn: `gateway-service/src/main.ts` còn proxy 3 prefix
`/api/internal/*` ra ngoài.

**Đã khai thác thật, qua gateway, không token:**

```
$ curl -X POST http://<host>:3000/api/internal/inventories/sale \
    -H 'Content-Type: application/json' \
    -d '{"variantId":"44444444-...-8444-444444444201","quantity":1}'

{"variantId":"...","quantity":1,"deductions":[{"batchId":"...","quantity":1}]}
```

Tồn kho `101 → 100`. Không cần đăng nhập, không cần quyền admin.
(`POST /api/internal/inventories/restore` đã trả lại về `101`.)

**Đọc được dữ liệu khách, không token:**

```
$ curl http://<host>:3000/api/internal/email-logs
```

Trả 11 bản ghi gồm email khách, mã đơn, chủ đề mail:
`{"recipient":"...@gmail.com","subject":"[DH_00016] Đơn hàng đã bị huỷ","status":"sent",...}`

**Danh sách route lọt qua gateway** (`main.ts:193,224,248`):

| route | hành động | HTTP | ý nghĩa |
|---|---|---|---|
| `POST /api/internal/inventories/sale` | trừ kho | 400 | **đã khai thác, sửa được số liệu** |
| `POST /api/internal/inventories/purchase` | nhập kho | 400 | sửa được số liệu |
| `POST /api/internal/inventories/restore` | cộng kho | 400 | sửa được số liệu |
| `POST /api/internal/receipts/from-invoice-payment` | tạo phiếu thu | 400 | tạo chứng từ giả |
| `POST /api/internal/payments/from-purchase` | tạo phiếu chi | 400 | tạo chứng từ giả |
| `GET /api/internal/email-logs` | đọc log mail | 200 | **lộ email + đơn của khách** |

36 route internal còn lại không lọt qua gateway, nhưng **19 service đều bind
`0.0.0.0`** trong `docker-compose.yaml`. Ai chạm được port host là gọi được hết:

```
GET  http://<host>:3001/api/internal/users/by-id/<uuid>          → 200, trả user thật
POST http://<host>:3001/api/internal/users                       → lọt nghiệp vụ
DELETE http://<host>:3001/api/internal/users/<uuid>              → lọt nghiệp vụ
DELETE http://<host>:3006/api/internal/customers/<uuid>          → lọt nghiệp vụ
POST http://<host>:3017/api/internal/audit-logs                  → ghi được log audit giả
```

Tức là **xoá được user, xoá được khách, giả lập được audit log** — mà audit log
chính là thứ dùng để truy vết.

### Sửa

1. **`X-Internal-Secret` cho mọi internal controller.** Một `InternalSecretGuard`
   trong `libs/security`, đọc `INTERNAL_API_SECRET` từ env, so sánh với header.
   19 controller thêm `@UseGuards(InternalSecretGuard)` — hoặc đăng ký `APP_GUARD`
   (xem P1-3) rồi đánh dấu controller internal bằng decorator riêng.
2. **Cắt `/api/internal/*` khỏi gateway.** Xoá 3 regex ở `main.ts:193,224,248`.
   **Đã kiểm tra: frontend không gọi `/internal/` nào** (`grep -rn "/internal/"
   frontend/src` → rỗng), nên cắt không làm hỏng gì. Endpoint
   `GET /api/internal/email-logs` sinh ra ở đợt notification chỉ để debug và
   không ai dùng — xoá luôn thay vì chuyển sang endpoint public có guard.
3. **Thu port về `127.0.0.1:xxxx` hoặc bỏ `ports` khỏi `docker-compose.yaml`.**
   Service nội bộ không cần mở ra host — gateway gọi qua tên service trong
   docker network. Đây là lớp phòng thủ thứ ba.

Cần thêm `INTERNAL_API_SECRET` vào `.env` + `.env.example`, và bỏ secret
dùng cho `JWT_SECRET` ra khỏi danh sách "ai cũng biết".

## P0-2. `POST /api/uploads` ẩn danh — up file tùy ý lên web

`storage-service/.../uploads.controller.ts:12-29` — controller không có guard
class, method cũng không, không `@Public()` nào cả.

**Đã chạy thật, không token:**

```
$ curl -X POST http://<host>:3000/api/uploads -F "image=@p.png;type=image/png"
{"imageUrl":"/api/uploads/cosmetics/68c912ca236b35c9fea72536b272aaee.png"}
```

File thật nằm trong thư mục public, URL tải được không cần đăng nhập.
(File đã xoá sau khi kiểm chứng.)

### Sửa

- Thêm `AuthGuard` + `@Permissions('cosmetics:write')` (hoặc `storage:write`
  tuỳ quyền đang có sẵn trong `authorization-service`).
- Chặt lại `imageUploadOptions`: size, số file, mime type thật chứ không tin
  `Content-Type` do client khai.

## P1-1. Không có guard toàn cục — quên một dòng là public

```
$ grep -rn "APP_GUARD" --include=*.ts apps/ libs/
(KHÔNG CÓ kết quả)
```

Không service nào đăng ký guard global. `@UseGuards` phải gõ tay từng
controller, quên là route public, **NestJS không cảnh báo**.

Bảng 40 route nằm trong controller không có guard:

| nhóm | route | ghi chú |
|---|---|---|
| 19 internal controller | 36 | xem P0-1 |
| `storage-service/.../uploads.controller.ts` | 1 | xem P0-2 |
| `order-service/.../best-sellers.controller.ts` | 1 | `GET /api/orders/best-sellers` — cố ý public? |
| `gateway-service.controller.ts` | 1 | health check, ổn |

### Sửa

- Đăng ký `APP_GUARD` = `AuthGuard` ở `main.ts` của từng service.
- Route chủ động public đánh dấu `@Public()` — **bắt buộc khai báo mới ra ngoài**.
- Điều này biến "quên guard" từ lỗi im lặng thành lỗi 401 lộ ra ngay.

Đây là thay đổi lan rộng nhất trong plan. Nên làm **sau** P0-1, không làm
cùng lúc — nếu không thì mỗi lần deploy đều phải dò lại toàn bộ 174 route.

## P1-2. Mật khẩu mặc định của nhân viên nằm trong source, in ra màn hình

Đúng loại lỗi vừa gỡ ở khách hàng, còn sót ở nhân viên:

```
frontend/src/services/employees.service.ts:20
const DEFAULT_PASSWORD = "Employee@123456";

frontend/src/services/employees.service.ts:88
password: payload.password || DEFAULT_PASSWORD,

frontend/src/pages/Admin/routes/AddEmployee/index.tsx:254
Để trống sẽ dùng mật khẩu mặc định: <code>Employee@123456</code>
```

Mọi tài khoản nhân viên tạo bỏ trống ô mật khẩu đều dùng chung một mật khẩu
mà ai đọc source cũng biết. Và **không có đường reset mật khẩu cho nhân viên**:
`user-service/public/users.controller.ts` chỉ có `PATCH :id/role`,
`:id/activate`, `:id/deactivate`. `auth-users/change-password` thì yêu cầu
`currentPassword` — mà nhân viên quên mật khẩu thì không vào được để đổi.
Quên là kẹt, không ai sửa được.

### Sửa

Bắt buộc có mật khẩu khi tạo nhân viên (admin tự nhập, hiển thị một lần để
chuyển tay, xoá khỏi DB ngay), hoặc sinh mật khẩu ngẫu nhiên 1 lần dùng.
Xoá `DEFAULT_PASSWORD` khỏi source và dòng chữ trên UI.

Làm kèm luôn **luồng quên mật khẩu** cho cả nhân viên lẫn khách — hiện tại
không có ai reset được.

## P2-1. Xoá khách làm đơn hàng mồ côi

`orders.customer_id` không có foreign key (mỗi DB chỉ có 2 FK, đều
`ON DELETE CASCADE`, không có `RESTRICT` nào). `DeleteCustomerUseCase` xoá
không kiểm tra điều kiện.

Đang có **5 đơn trỏ tới 2 khách đã bị xoá**:

| đơn | customer_id đã xoá |
|---|---|
| `DH_00005` | `2aba834b-…` |
| `DH_00008` `DH_00009` `DH_00010` `DH_00011` | `fdd720a1-…` |

(6 đơn còn lại là walk-in dùng sentinel `00000000-…-0001`, cố ý không tồn tại
trong bảng `customers` — không tính là orphan.)

Xoá khách là mất vĩnh viễn lịch sử mua của họ, và không ai phát hiện được vì
báo cáo chỉ hiện "Khách vãng lai / POS".

### Sửa — cần bạn chọn

- **Chặn xoá** khi khách còn đơn: `DeleteCustomerUseCase` gọi
  `order-service` kiểm tra, hoặc order-service expose
  `GET /api/internal/customers/:id/order-count`.
- **Soft-delete**: thêm `deleted_at`, mọi query lọc `deleted_at is null`.
  Giữ được lịch sử nhưng phải rà lại mọi nơi đọc khách.

Tôi nghiêng về **chặn xoá** — ít thay đổi hơn và `DeleteCustomerUseCase`
chỉ vài chục dòng.

## P2-2. Không có test để chống hồi quy

3 file `.spec.ts`, đều là test sinh sẵn lúc `nest new`. 174 route, 19 service,
0 test nghiệp vụ. Sửa gì cũng không có gì bắt phải giữ nguyên.

Bắt đầu từ đúng ba luồng vừa đụng tới:

| luồng | cần bảo đảm |
|---|---|
| đăng ký | tạo 1 user + 1 customer + N phone + M address |
| POS bán walk-in | trừ kho đúng số lượng, `customerName = null` |
| `place-order` → `ship-order` | **chỉ trừ kho 1 lần** (đã chứng minh `ship-order` không trừ thêm, cần test giữ nguyên được) |

Test e2e Nest (`@nestjs/testing` + `supertest`) chạy trên service thật, DB
test riêng. Cần `test` script trong `package.json` — hiện có không thì thêm.

## P3. Việc còn lại, nhỏ, gộp cuối

| việc | vị trí |
|---|---|
| `EditCustomer` ghi SĐT và địa chỉ bằng 2 request — ghi dở thì lệch | `EditCustomer/index.tsx:99,107` |
| `AddPhoneRequest` chưa có regex ở tầng DTO (domain vẫn chặn đúng) | `public/customers/requests/add-phone.request.ts` |
| Mail Resend lỗi không retry — sửa thành upsert dòng `failed` | `MikroEmailLogsRepository.save()` |
| `KH_00003` `KH_00004` thiếu SĐT + địa chỉ (mất lúc test) | cần bạn nhập lại |
| `KH_00007` có SĐT 9 số `097228340`, sai chuẩn VN 10 số | dữ liệu cũ |
| `KH_00012` có `user_id` rỗng | dữ liệu cũ |
| `docs/PLAN.md` bị `.gitignore:6` loại | `.gitignore` |

---

## Thứ tự đề xuất

Mỗi mục một branch riêng, test bằng lệnh khai thác nêu trên trước khi làm mục sau.

1. **P0-1** chặn internal + cắt gateway + thu port. Đây là lỗ hổng đang
   mở trên internet, sửa gấp nhất.
2. **P0-2** chặn `uploads`.
3. **P1-1** guard toàn cục — làm sau P0-1 để mỗi đợt deploy chỉ phải dò lại
   phần vừa đổi, không dò cả 174 route.
4. **P1-2** mật khẩu nhân viên + luồng quên mật khẩu.
5. **P2-1** chặn xoá khách (cần bạn chọn chặn hay soft-delete).
6. **P2-2** test ba luồng cốt lõi.
7. **P3** gộp một lượt.

## Verify chung cho mọi mục

Sau khi sửa, các lệnh này **phải trả 401/403** — hiện tại đều trả 200/400:

```bash
curl -X POST http://<host>:3000/api/internal/inventories/sale \
  -H 'Content-Type: application/json' -d '{"variantId":"...","quantity":1}'

curl http://<host>:3000/api/internal/email-logs

curl -X POST http://<host>:3000/api/uploads -F "image=@p.png;type=image/png"

curl http://<host>:3001/api/internal/users/by-id/<uuid>
```

## Rủi ro khi sửa

| rủi ro | xử lý |
|---|---|
| Cắt `/api/internal/*` khỏi gateway làm frontend hỏng | đã kiểm tra frontend không gọi `/internal/` nào — không có rủi ro này |
| Thêm `X-Internal-Secret` làm service gọi nhau fail nếu quên set env | adapter service-to-service set header ở **một** chỗ dùng chung, không rải `fetch` |
| `APP_GUARD` toàn cục làm route public cũ trả 401 | khai `@Public()` theo danh sách route public **có sẵn** trước khi bật; deploy kèm smoke test 174 route |
| Thu port làm máy dev không truy cập được service | dùng `docker compose exec` để debug, hoặc bật port qua profile `dev` |
| Chặn xoá khách làm admin bị chặn xoá nhầm | trả message rõ "khách còn N đơn chưa xoá" thay vì lỗi chung chung |
