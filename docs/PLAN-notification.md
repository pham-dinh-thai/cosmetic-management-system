# Plan: gửi mail thông báo trạng thái đơn hàng (Resend + BullMQ)

## Vấn đề đang giải

9 use-case trong `order-service` tạo domain event rồi bỏ đi:

```ts
order.pullDomainEvents();   // gọi xong vứt, không ai nhận
```

| use-case | dòng | event |
|---|---|---|
| confirm-order | 36 | `OrderConfirmed` |
| prepare-order | 21 | `OrderPreparing` |
| ship-order | 29 | `OrderShipping` |
| deliver-order | 21 | `OrderDelivered` |
| complete-order | 31 | `OrderCompleted` |
| cancel-order | 28 | `OrderCancelled` |
| return-order | 28 | `OrderReturned` |
| refund-order | 22 | `OrderRefunded` |
| delivery-failed-order | 21 | `OrderDeliveryFailed` |

Không có đường đi nào từ `order-service` tới khách hàng. Đây là chỗ cắm email vào.

## Ràng buộc đã chốt

- Resend, domain đã verify (chỉ cần DNS ở domain, không phụ thuộc web chạy hay không)
- BullMQ trên Redis — Redis đã có sẵn trong `docker-compose`, `ioredis` đã dùng
- Chỉ gửi cho khách, khi đơn đổi trạng thái
- Có `email_log` để chống gửi trùng khi retry

## Dữ liệu

Bảng `customers` **không có** cột email. Nhưng `GET /internal/customers/:id` đã join
sẵn từ `user-service` và trả cả `email`, nên chỉ **một chặng** là đủ:

```
order event (customerId)
  → GET customer-service /api/internal/customers/:id   → email, name, code
```

Template lấy `code`, `totalAmount`, `paymentStatus`, `recipientName` từ
`Order` aggregate — đều có sẵn getter, không cần query thêm.

## Kiến trúc

Port trừ provider ở tầng application, nên đổi Resend sang SendGrid chỉ viết
adapter khác, không đụng business logic.

```
libs/event-bus/                          publish event lên BullMQ
apps/notification-service/               consume + dựng nội dung mail
  application/ports/mail-sender.port.ts  IMailSenderPort
  infrastructure/adapters/resend-mail-sender.adapter.ts
```

### 1. `libs/event-bus/`

- `DomainEventPublisherPort` — `publish(events: DomainEventEnvelope[])`
- `BullMqEventPublisherAdapter` — đẩy vào queue `order-events`
- Envelope là JSON thuần: `{ type, orderId, customerId, code, totalAmount,
  paymentStatus, recipientName, occurredAt }` — không kéo object domain qua
  biên process

Chi tiết quan trọng: event phải publish **sau** khi `ordersRepository.updateStatus()`
thành công. Publish trước rồi rollback thì khách nhận mail về đơn chưa tồn tại.

### 2. `apps/notification-service/`

| phần | nội dung |
|---|---|
| port | `IMailSenderPort` → `{ providerId }` |
| adapter | `ResendMailSenderAdapter` gọi `resend.emails.send()` |
| adapter | `CustomerContactAdapter` gọi customer-service |
| template | 9 template HTML, một file, dùng chung layout |
| worker | BullMQ `Worker` xử lý `order-events` |
| entity | `EmailLog` — `orderId`, `eventType`, `to`, `subject`, `status`, `providerId`, `error` |

Idempotency: `idempotencyKey: \`${eventType}/${orderId}\`` kèm unique index trên
`EmailLog(order_id, event_type)`. Retry không gửi trùng.

### 3. Sửa 9 use-case

Đổi `order.pullDomainEvents();` thành `await this.eventPublisher.publish(order.pullDomainEvents());`
và thêm port vào factory. Publish nằm sau `updateStatus()`.

Publish fail không được làm hỏng cả luồng đơn hàng — bọc try/catch, log, tiếp tục.
Mất 1 mail còn hơn khách không đặt được hàng.

## Hạ tầng

- `constants/ports.ts`: `NOTIFICATION_SERVICE_PORT = 3018` (3018 đang trống)
- `docker-compose.yaml`: service mới, port 3018
- `gateway-service/src/main.ts`: proxy `/api/notification*` (nếu cần truy vận log)
- `.env` + `.env.example`: `RESEND_API_KEY`, `RESEND_FROM`, `NOTIFICATION_DB_*`

## Thứ tự làm

1. `libs/event-bus` + đăng ký path alias
2. `notification-service`: port, adapter, template, worker, entity
3. Migration `email_logs`
4. Sửa 9 use-case publish event
5. `.env`, `docker-compose`, `constants/ports`
6. Verify: tsc, eslint, build, deploy, đổi trạng thái đơn thật và xem mail

## Verify

- `tsc --noEmit` + eslint sạch
- Migration chạy thật
- Bấm "Xác nhận" trên 1 đơn thật → `email_log` có 1 dòng `status=sent`,
  `provider_id` khác rỗng, mail về Gmail của khách
- Consumer tắt → đổi trạng thái → job tồn đọc trong Redis, bật lại → vẫn gửi đúng 1 lần
- `/orders/me` và `GET /orders` không đổi hành vi

## Rủi ro

| rủi ro | xử lý |
|---|---|
| Publish lỗi làm hỏng luồng đơn | try/catch + log |
| Retry gửi trùng | idempotency key + unique index |
| Khách không có email | bỏ qua, ghi `status=skipped` |
| Resend trả lỗi 4xx/5xx | ghi `error` vào log, không retry vô hạn (`attempts: 3`) |
| Repo đang commit `.env` | không log API key ra log |
