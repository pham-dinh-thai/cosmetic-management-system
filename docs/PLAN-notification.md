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
apps/order-service/src/shared/            publish event lên BullMQ
apps/notification-service/                consume + dựng nội dung mail
  application/ports/mail-sender.port.ts  IMailSenderPort
  infrastructure/adapters/resend-mail-sender.adapter.ts
```

### 1. `order-service/src/shared/`

- `EVENT_PUBLISHER_PORT` (`IOrderEventPublisherPort`) — `publish(events: OrderEventEnvelope[])`
- `BullMqEventPublisherAdapter` — đẩy vào queue `order-events`
- Envelope là JSON thuần: `{ eventType, payload: { orderId, customerId, code,
  totalAmount, paymentStatus, recipientName, occurredAt } }` — không kéo object
  domain qua biên process
- `OrderEventPublisherModule` tự tạo connection BullMQ riêng, không dùng chung
  `REDIS_CLIENT` (lib đó đặt `maxRetriesPerRequest: 1`, BullMQ bắt buộc `null`)

Chi tiết quan trọng: event phải publish **sau** khi `ordersRepository.updateStatus()`
thành công. Publish trước rồi rollback thì khách nhận mail về đơn chưa tồn tại.

### 2. `apps/notification-service/`

| phần | nội dung |
|---|---|
| port | `IMailSenderPort` → `{ providerId }` |
| port | `ICustomerContactReaderPort` → `{ email, name }` |
| adapter | `ResendMailSenderAdapter` gọi `resend.emails.send()` |
| adapter | `CustomerContactReaderAdapter` gọi `GET customer-service /api/internal/customers/:id` |
| template | 9 template HTML, một file, dùng chung layout |
| worker | BullMQ `Worker` xử lý `order-events` |
| entity | `EmailLog` — `orderId`, `eventType`, `recipient`, `subject`, `status`, `providerId`, `error` |
| endpoint | `GET /api/internal/email-logs?orderId=` để tra lịch sử gửi |

Chống gửi trùng: unique constraint `email_logs (order_id, event_type)`. Worker
tra log trước, đã có thì bỏ qua — BullMQ retry không gửi trùng.

### 3. Sửa 10 use-case

`await this.orderEventPublisherPort.publish(pullOrderEventEnvelopes(order))` —
9 use-case ở `orders/`, 1 ở `my-orders/` (`cancel-my-order`). Publish nằm sau
`updateStatus()`. `pullOrderEventEnvelopes()` rút phần mapping 16 dòng về 1 chỗ.

Không bọc try/catch quanh publish: nếu Redis chết, đổi trạng thái đơn cũng
rollback — mất 1 mail còn hơn mất luồng đặt hàng.

## Hạ tầng

- `constants/ports.ts`: `NOTIFICATION_SERVICE_PORT = 3018`
- `docker-compose.yaml`: service mới port 3018 + `backend/Dockerfile` thêm
  `notification-service` vào vòng lặp build
- `docker/postgres/init-dbs.sh`: `cosmetic_notification` + DB riêng
- `gateway-service/src/main.ts`: proxy `/api/internal/email-logs` + `/api/notifications`
- `.env` + `.env.example`: `NOTIFICATION_DB_*`, `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_REPLY_TO`

## Thứ tự làm

1. `order-service/src/shared/`: port + BullMQ adapter + `pullOrderEventEnvelopes`
2. Sửa 10 use-case publish event
3. `notification-service`: port, adapter, template, worker, entity
4. Migration `email_logs`
5. `.env`, `docker-compose`, `init-dbs.sh`, `constants/ports`, `Dockerfile`
6. Verify: tsc, eslint, build, deploy, đổi trạng thái đơn thật và xem mail

## Verify

- [x] `tsc --noEmit` + eslint sạch
- [x] Migration chạy thật, unique constraint `(order_id, event_type)` có trong DB
- [x] `DH_00011` `delivered → completed` → `email_logs` có 1 dòng `status=sent`,
      `provider_id` khác rỗng, mail về Gmail của khách
- [x] Đẩy lại cùng event (giống BullMQ retry) → worker log "bo qua", `email_logs`
      vẫn đúng 1 dòng
- [x] Consumer tắt → đổi trạng thái → job tồn đọc trong Redis, bật lại → vẫn gửi đúng 1 lần
- [x] `GET /orders` không đổi hành vi

## Rủi ro

| rủi ro | xử lý |
|---|---|
| Publish lỗi làm hỏng luồng đơn | chấp nhận: publish nằm trong transaction chuyển trạng thái |
| Retry gửi trùng | tra `email_logs` trước + unique constraint `(order_id, event_type)` |
| Resend lỗi 4xx lặp lại 3 lần | log `FAILED` cũng chặn retry — cố ý, tránh spam khách khi địa chỉ sai. Lỗi DB hoặc customer-service down (chưa ghi được log) vẫn retry bình thường |
| Khách không có email | bỏ qua, ghi `status=skipped` |
| Resend trả lỗi 4xx/5xx | ghi `error` vào log, không retry vô hạn (`attempts: 3`) |
| `.env` có API key | file nằm trong `.gitignore`, không commit; không log key ra log |

