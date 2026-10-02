# Plan: đóng lố hổng endpoint nội bộ

Tiếp nối `PLAN-hardening.md`. Viết lại phần còn lại theo những gì đã **kiểm chứng
bằng cách chạy thật**, và bỏ 2 chỗ bản cũ nói quá.

## Đã xong

| việc | branch | kết quả đo được |
|---|---|---|
| Ẩn port 18 service | `chore/hide-service-ports` | 36 route internal từ host → `HTTP 000` |

Còn lại 16 service dùng tên service gọi nhau (`http://<ten>:<port>`), nên ẩn port
không đụng gì tới luồng chạy. Đã chạy lại đăng ký (4 service) và đặt hàng
(5 service) sau khi ẩn — tồn kho trừ đúng, huỷ đơn hoàn đúng.

## Còn lộ gì, đo được

### Qua gateway — 6 route

| route | HTTP | tác hại |
|---|---|---|
| `POST /api/internal/inventories/sale` | 400 | sửa tồn kho — **đã khai thác, 101 → 100** |
| `POST /api/internal/inventories/purchase` | 400 | sửa tồn kho |
| `POST /api/internal/inventories/restore` | 400 | sửa tồn kho |
| `POST /api/internal/receipts/from-invoice-payment` | 400 | tạo phiếu thu giả |
| `POST /api/internal/payments/from-purchase` | 400 | tạo phiếu chi giả |
| `GET /api/internal/email-logs` | **200** | lộ email + mã đơn của khách |

### Qua gateway — upload ẩn danh

`POST /api/uploads` không token, PNG thật → trả `imageUrl`, tải lại được không
cần đăng nhập.

**Sửa lại mức độ so với bản cũ:** bản cũ ghi "upload file tùy ý" là sai. Đo lại:

```
file .png/.webp thật  → 200, upload thành công
file .html            → "Unsupported image type .html"
file .svg             → "Unsupported image type .svg"
file text tên .png    → "File content is not a valid image"
```

Chỉ nhận jpg/png/webp/gif, và kiểm cả nội dung lẫn phần mở rộng. **Không up được
HTML/SVG nên không có stored XSS.** Đây là lạm dụng dung lượng và mơm file rác
vào thư mục ảnh, không phải arbitrary file upload.

---

## Việc 1 — Cắt gateway proxy `/api/internal/*` (3 dòng)

`backend/apps/gateway-service/src/main.ts`, 3 chỗ:

| dòng | hiện tại | đổi thành |
|---|---|---|
| 193 | `/^\/api\/(inventories\|internal\/inventories\|stock-adjustments)(\/\|$)/` | `/^\/api\/(inventories\|stock-adjustments)(\/\|$)/` |
| 224 | `/^\/api\/(receipts\|payments\|internal\/receipts\|internal\/payments)(\/\|$)/` | `/^\/api\/(receipts\|payments)(\/\|$)/` |
| 248 | `/^\/api\/(internal\/email-logs\|notifications)(\/\|$)/` | `/^\/api\/notifications(\/\|$)/` |

Không cần dời gì đi nơi khác. Đã kiểm `grep -rn "/internal/" frontend/src` → rỗng,
frontend không gọi route internal nào.

Giữ `notifications` trong regex 248 dù hiện chưa có route public tương ứng:
`notification-service` chỉ có đúng `internal/email-logs`. Regex thành vô nghĩa
nhưng giữ nguyên ý định, sau này thêm route public là chạy.

### Verify

Sáu route trong bảng trên phải trả `404 Cannot GET/POST` qua cả `:3000` và `:80`.
Chạy lại đăng ký và đặt hàng để chắc service-to-service không dùng nhầng gateway.

---

## Việc 2 — Chặn `POST /api/uploads` (3 file)

Cần **3** thay đổi, thiếu một là hỏng. Đây là chỗ dễ dính bẫy nhất: `storage-service`
hiện không có cả hai thứ.

### 2a. `storage-service` không có `JwtModule`

`AuthGuard` cần `JwtService`. `basket-service` đăng ký kiểu này
(`basket-service.module.ts:56`):

```ts
imports: [
  ConfigModule.forRoot({ envFilePath: '../.env', isGlobal: true }),
  JwtModule.registerAsync({
    useFactory: (config: ConfigService) => ({
      secret: config.get<string>('JWT_ACCESS_SECRET'),
    }),
    inject: [ConfigService],
  }),
],
```

`storage-service.module.ts` hiện chỉ có `ConfigModule` — thêm `JwtModule` y hệt.

### 2b. `storage-service` không có biến môi trường

`docker-compose.yaml`, khối `storage-service`, hiện chỉ có:

```yaml
    environment:
      UPLOAD_ROOT: /app/uploads
```

Thêm `JWT_ACCESS_SECRET: ${JWT_ACCESS_SECRET}`. Thiếu dòng này thì `JwtService`
verify ra `undefined` và **mọi lần upload đều 401**, kể cả admin.

### 2c. Guard ở controller

Theo convention sẵn có — `cosmetics.controller.ts:68` dùng:

```ts
import { UseGuards } from '@nestjs/common';
import { AuthGuard, Permissions, PermissionsGuard } from '@app/security';

@UseGuards(AuthGuard, PermissionsGuard)
@Controller('uploads')
export class UploadsController {
  @Permissions('cosmetics:write')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  @Post()
  public uploadImage(...)
}
```

`AuthGuard` và `PermissionsGuard` là hai guard riêng, phải khai cả hai.
`PermissionsGuard` cho admin qua luôn (`ADMIN_ROLE_ID = 'admin'`), nên admin vẫn
upload được. Cần nhân viên có `cosmetics:write` mới upload được — nhân viên nhập
kho không có quyền này thì không upload, đúng.

`cosmetics:write` vì chỉ `AddProduct` và `EditProduct` gọi endpoint này
(`products.service.ts:150`, dùng ở `AddProduct/hook.ts:42` và
`EditProduct/hook.ts:143`).

### Không đụng `GET /api/uploads/*`

nginx phục vụ file tĩnh qua `location ^~ /api/uploads/ { alias /var/uploads/ }`.
Đó là ảnh sản phẩm hiển thị trên trang, phải công khai. Chỉ `POST` bị chặn.

### Verify

```bash
# không token → 401
curl -X POST http://<host>/api/uploads -F "image=@p.png;type=image/png"
# token admin → 201
curl -X POST http://<host>/api/uploads -H "Authorization: Bearer $A" -F "image=@p.png;type=image/png"
# token khách (role customer) → 403
```

Upload thật từ UI `AddProduct` để chắc form ảnh vẫn chạy.

---

## Việc 3 — `X-Internal-Secret` cho 16 internal controller (tùy chọn)

Sau việc 1 và 2, route internal **chỉ còn gọi được từ trong docker network** —
port đã ẩn, gateway đã cắt. Đe dọa còn lại là RCE vào một container, mà lúc đó
hệ thống hỏng nặng hơn nhiều vì một lỗi upload. Nên có thể dừng ở đây.

Nếu muốn làm tiếp, phải đúng 2 phía — không chỉ phía nhận:

| phía | việc | số file |
|---|---|---|
| nhận | 16 internal controller kiểm tra header | 16 |
| gửi | ~50 adapter gửi kèm header | ~50 |

`HttpService`/`@nestjs/axios` **không dùng ở đâu cả**, tất cả là `fetch` tay
(ví dụ `user-information.adapter.ts:28`, `employee-code-reader.adapter.ts:17`).
Sửa tay là 66 file, dễ sót — sót một chỗ thì hoặc flow đứt, hoặc cửa mở.

Đúng nhất là một chỗ duy nhất:

- `libs/security/src/internal-secret.guard.ts` — `timingSafeEqual` so header với
  `INTERNAL_API_SECRET`
- `libs/internal-client` — `internalFetch(url, init)` tự gắn header; adapter đổi
  `fetch` sang nó. Xong là không còn đường nào bypass được.

### Không dùng lại `JWT_ACCESS_SECRET` cho việc này

Ba lý do:

1. **Rò header thành rò toàn bộ quyền.** Header nội bộ bình thường vô nghĩa. Gán
   nó bằng secret ký token người dùng thì lọt giá trị đó ở log lỗi, log proxy hay
   trace là kẻ đó ký được token admin. Nhảy từ "gọi được vài endpoint" thành
   "đăng nhập hộp thư bất kỳ ai".
2. **Không xoay được riêng.** `JWT_ACCESS_SECRET` nằm trong cả 16 service. Muốn
   buộc mọi phiên hết hạn thì phải xoay cả 16 cùng lúc, không xoay riêng được.
3. **Không thêm isolation nào.** Secret đó vốn đã không phải bí mật *giữa các
   service*, chỉ là bí mật so với bên ngoài. Dùng lại cũng chỉ đạt đúng mức
   chặn internet.

Chi phí tách secret mới: 2 dòng trong `.env` và `.env.example`.

---

## Việc 4 — `APP_GUARD` toàn cục

`grep -rn "APP_GUARD"` → rỗng. Không service nào có guard toàn cục, nên
`@UseGuards` phải gõ tay từng controller và **quên một dòng là route public, NestJS
không cảnh báo**.

**40/174 route** nằm trong controller không có guard nào: 19 internal (36),
`UploadsController` (1), `BestSellersController` (1, cố ý public),
`gateway-service.controller.ts` (1, health check).

Đăng ký `APP_GUARD` = `AuthGuard`, rồi đánh dấu route chủ động public bằng
`@Public()` — bắt buộc khai báo mới ra ngoài. Biến "quên guard" từ lỗi im lặng
thành lỗi 401 lộ ngay.

Làm **sau** việc 3, không làm cùng lúc: nếu gộp thì mỗi lần deploy phải dò lại
cả 174 route.

---

## Thứ tự làm

1. Việc 1 — 3 dòng, bịt 6 route đang mở
2. Việc 2 — 3 file, bịt upload ẩn danh. **Sửa 2a và 2b trước 2c**, nếu không
   upload hỏng ngay
3. Dừng lại, deploy thử. Việc 3 tùy chọn, việc 4 để đợt sau

## Rủi ro

| rủi ro | xử lý |
|---|---|
| Thêm guard cho uploads mà quên `JWT_ACCESS_SECRET` | mọi lần upload 401, kể cả admin — sửa dòng env là hết |
| Thêm `JwtModule` nhưng `ConfigService` chưa có trong scope | `isGlobal: true` đã có sẵn trong module, `inject: [ConfigService]` chạy được |
| Cắt gateway làm vỡ flow nào đó | frontend không gọi `/internal/`; adapter gọi thẳng URL service qua docker network, không qua gateway — nhưng vẫn phải chạy lại đăng ký + đặt hàng để chắc |
| Nhân viên không có `cosmetics:write` không upload được | đúng; upload ảnh là việc của quản lý mỹ phẩm |
| `Việc 3` làm 66 file, dễ sót | nếu làm thì bắt buộc qua `internalFetch` một chỗ, không sửa tay rải header |