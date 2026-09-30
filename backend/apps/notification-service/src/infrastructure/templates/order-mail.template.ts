import { OrderEventPayload } from '../../domain/order-event';

type Template = {
  subject: (payload: OrderEventPayload) => string;
  heading: (payload: OrderEventPayload) => string;
  body: (payload: OrderEventPayload) => string;
};

const formatAmount = (amount: number): string =>
  new Intl.NumberFormat('vi-VN').format(amount) + ' đ';

const customerName = (payload: OrderEventPayload): string =>
  payload.recipientName?.trim() || 'Quý khách';

const orderSummary = (payload: OrderEventPayload): string => `
    <table role="presentation" style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px;color:#3f3f46">
      <tr>
        <td style="padding:8px 0;color:#71717a">Mã đơn hàng</td>
        <td style="padding:8px 0;font-weight:600">${payload.code}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#71717a">Tổng thanh toán</td>
        <td style="padding:8px 0;font-weight:600">${formatAmount(payload.totalAmount)}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#71717a">Trạng thái thanh toán</td>
        <td style="padding:8px 0;font-weight:600">${payload.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
      </tr>
    </table>`;

const layout = (heading: string, content: string): string => `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </head>
  <body style="margin:0;padding:24px;background:#fafafa;font-family:-apple-system,Segoe UI,Roboto,sans-serif">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e4e4e7">
      <p style="margin:0 0 4px;font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:#a16207">Guardian Skincare</p>
      <h1 style="margin:0 0 16px;font-size:20px;line-height:1.4;color:#18181b">${heading}</h1>
      ${content}
      <p style="margin:32px 0 0;font-size:13px;color:#a1a1aa">Trân trọng,<br />Guardian Skincare</p>
    </div>
  </body>
</html>`;

const templates: Record<string, Template> = {
  OrderConfirmed: {
    subject: (p) => `[${p.code}] Đơn hàng của bạn đã được xác nhận`,
    heading: () => 'Đơn hàng đã được xác nhận',
    body: (p) =>
      `<p style="margin:0;color:#3f3f46;line-height:1.6">Chào ${customerName(p)}, đơn hàng của bạn đã được xác nhận và sẽ sớm được chuẩn bị.</p>${orderSummary(p)}`,
  },
  OrderPreparing: {
    subject: (p) => `[${p.code}] Đơn hàng đang được chuẩn bị`,
    heading: () => 'Đơn hàng đang được chuẩn bị',
    body: (p) =>
      `<p style="margin:0;color:#3f3f46;line-height:1.6">Chào ${customerName(p)}, chúng tôi đang đóng gói đơn hàng của bạn.</p>${orderSummary(p)}`,
  },
  OrderShipping: {
    subject: (p) => `[${p.code}] Đơn hàng đã được gửi đi`,
    heading: () => 'Đơn hàng đã được gửi đi',
    body: (p) =>
      `<p style="margin:0;color:#3f3f46;line-height:1.6">Chào ${customerName(p)}, đơn hàng của bạn đã được chuyển cho đơn vị vận chuyển.</p>${orderSummary(p)}`,
  },
  OrderDelivered: {
    subject: (p) => `[${p.code}] Đơn hàng đã được giao`,
    heading: () => 'Đơn hàng đã được giao',
    body: (p) =>
      `<p style="margin:0;color:#3f3f46;line-height:1.6">Chào ${customerName(p)}, đơn hàng của bạn đã được giao thành công. Hãy kiểm tra sản phẩm và phản hồi cho chúng tôi nếu cần.</p>${orderSummary(p)}`,
  },
  OrderCompleted: {
    subject: (p) => `[${p.code}] Cảm ơn bạn đã mua hàng`,
    heading: () => 'Cảm ơn bạn đã mua hàng',
    body: (p) =>
      `<p style="margin:0;color:#3f3f46;line-height:1.6">Chào ${customerName(p)}, cảm ơn bạn đã đồng hành cùng Guardian Skincare. Rất mong được phục vụ bạn lần sau.</p>${orderSummary(p)}`,
  },
  OrderCancelled: {
    subject: (p) => `[${p.code}] Đơn hàng đã bị huỷ`,
    heading: () => 'Đơn hàng đã bị huỷ',
    body: (p) =>
      `<p style="margin:0;color:#3f3f46;line-height:1.6">Chào ${customerName(p)}, đơn hàng ${p.code} đã bị huỷ. Nếu đây không phải ý bạn, hãy liên hệ với chúng tôi.</p>${orderSummary(p)}`,
  },
  OrderReturned: {
    subject: (p) => `[${p.code}] Yêu cầu trả hàng đã được tiếp nhận`,
    heading: () => 'Đã tiếp nhận yêu cầu trả hàng',
    body: (p) =>
      `<p style="margin:0;color:#3f3f46;line-height:1.6">Chào ${customerName(p)}, chúng tôi đã tiếp nhận yêu cầu trả hàng cho đơn ${p.code} và sẽ liên hệ với bạn.</p>${orderSummary(p)}`,
  },
  OrderRefunded: {
    subject: (p) => `[${p.code}] Đơn hàng đã được hoàn tiền`,
    heading: () => 'Đơn hàng đã được hoàn tiền',
    body: (p) =>
      `<p style="margin:0;color:#3f3f46;line-height:1.6">Chào ${customerName(p)}, khoản thanh toán của đơn ${p.code} đã được hoàn lại. Thời gian nhận tiền phụ thuộc vào ngân hàng của bạn.</p>${orderSummary(p)}`,
  },
  OrderDeliveryFailed: {
    subject: (p) => `[${p.code}] Giao hàng không thành công`,
    heading: () => 'Giao hàng không thành công',
    body: (p) =>
      `<p style="margin:0;color:#3f3f46;line-height:1.6">Chào ${customerName(p)}, chúng tôi chưa thể giao đơn ${p.code}. Vui lòng cập nhật số điện thoại hoặc địa chỉ, hoặc liên hệ để chúng tôi sắp xếp giao lại.</p>${orderSummary(p)}`,
  },
};

export type RenderedMail = { subject: string; html: string };

export const renderOrderMail = (
  eventType: string,
  payload: OrderEventPayload,
): RenderedMail | null => {
  const template = templates[eventType];

  if (!template) {
    return null;
  }

  return {
    subject: template.subject(payload),
    html: layout(template.heading(payload), template.body(payload)),
  };
};
