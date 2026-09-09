import api from "../config/axios";

export interface PosOrderItem {
  cosmeticId: string;
  variantId: string;
  quantity: number;
  unitPrice?: number;
  productName?: string;
  variantName?: string;
  imageUrl?: string | null;
}

export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "CARD";

export interface CreatePosOrderPayload {
  customerId?: string | null;
  items: { variantId: string; quantity: number }[];
  paymentMethod: PaymentMethod;
}

export interface PosOrderResponse {
  id: string;
  status?: string;
  total: number;
  paymentMethod: PaymentMethod;
}

export interface BestSellerItem {
  variantId: string;
  quantitySold: number;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED';

export interface OrderReadModel {
  id: string;
  code: string;
  customerId: string | null;
  customerName: string | null;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderDetailLine {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDetailReadModel {
  id: string;
  code: string;
  customerId: string;
  status: OrderStatus;
  totalAmount: number;
  lines: OrderDetailLine[];
  createdAt: string;
  updatedAt: string;
}

const escapeHtml = (value: string): string =>
  value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] ?? character);

const formatMoney = (value: number): string =>
  `${value.toLocaleString('vi-VN')}₫`;

const paymentMethodLabel: Record<PaymentMethod, string> = {
  CASH: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản',
  CARD: 'Thẻ',
};

export function renderReceipt(order: OrderReadModel, detail: OrderDetailReadModel): string {
  const createdAt = new Date(detail.createdAt);
  const dateText = Number.isNaN(createdAt.getTime())
    ? detail.createdAt
    : createdAt.toLocaleString('vi-VN');
  const itemRows = detail.lines.map((line) => `
    <tr>
      <td class="item">${escapeHtml(line.variantId)}</td>
      <td class="number">${line.quantity}</td>
      <td class="number">${formatMoney(line.unitPrice)}</td>
      <td class="number">${formatMoney(line.subtotal)}</td>
    </tr>`).join('');

  return `<!doctype html>
<html lang="vi"><head><meta charset="UTF-8" />
<title>Hóa đơn ${escapeHtml(order.code)}</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #eee; color: #111; font-family: Arial, sans-serif; }
  .receipt { width: 80mm; min-height: 120mm; margin: 0 auto; padding: 5mm 4mm 7mm; background: #fff; }
  .brand { text-align: center; font-size: 21px; font-weight: 900; letter-spacing: -1.5px; }
  .brand span { font-size: 12px; vertical-align: top; }
  h1 { margin: 1px 0 6px; text-align: center; font-size: 13px; letter-spacing: .3px; }
  .meta { text-align: center; font-size: 9px; line-height: 1.55; }
  .customer { margin: 7px 0 5px; font-size: 9px; }
  table { width: 100%; border-collapse: collapse; font-size: 9px; }
  th { padding: 4px 0; border-top: 1px dashed #333; border-bottom: 1px dashed #333; font-weight: 700; }
  td { padding: 3px 0; vertical-align: top; }
  .item { width: 37%; padding-right: 3px; word-break: break-word; }
  .number { text-align: right; white-space: nowrap; padding-left: 2px; }
  .totals { margin-top: 5px; padding-top: 4px; border-top: 1px dashed #333; font-size: 10px; }
  .total-line { display: flex; justify-content: space-between; padding: 2px 0; }
  .grand-total { font-weight: 800; font-size: 12px; }
  .qr { width: 25mm; height: 25mm; margin: 9px auto 4px; border: 3px solid #111;
    background: repeating-conic-gradient(#111 0 25%, #fff 0 50%) 50% / 6px 6px; }
  .note { text-align: center; font-size: 8px; line-height: 1.35; }
  .barcode { height: 11mm; margin: 6px 8px 2px; background: repeating-linear-gradient(90deg, #111 0 1px, #fff 1px 2px, #111 2px 4px, #fff 4px 6px, #111 6px 7px, #fff 7px 9px); }
  .barcode-code { text-align: center; font-size: 8px; letter-spacing: 2px; }
  @media screen { .receipt { margin-top: 16px; box-shadow: 0 2px 16px #bbb; } }
  @media print { body { background: #fff; } .receipt { box-shadow: none; } }
</style></head><body>
<main class="receipt">
  <div class="brand">SEED BEAUTY<span>+</span></div>
  <h1>PHIẾU TÍNH TIỀN</h1>
  <div class="meta">${escapeHtml(dateText)}<br>Mã đơn: ${escapeHtml(order.code)}</div>
  <div class="customer">Khách hàng: <b>${escapeHtml(order.customerName || 'Khách lẻ')}</b></div>
  <table><thead><tr><th class="item">Mặt hàng</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
  <tbody>${itemRows}</tbody></table>
  <div class="totals">
    <div class="total-line"><span>Tạm tính</span><span>${formatMoney(detail.totalAmount)}</span></div>
    <div class="total-line"><span>Thanh toán</span><span>${escapeHtml(paymentMethodLabel[order.paymentMethod])}</span></div>
    <div class="total-line grand-total"><span>TỔNG TIỀN</span><span>${formatMoney(detail.totalAmount)}</span></div>
  </div>
  <div class="qr" aria-label="Mã QR hóa đơn"></div>
  <div class="note">Cảm ơn quý khách đã mua hàng!<br>Vui lòng giữ lại hóa đơn để đối chiếu.</div>
  <div class="barcode"></div>
  <div class="barcode-code">${escapeHtml(order.code)}</div>
</main>
<script>window.addEventListener('load', () => setTimeout(() => window.print(), 180));</script>
</body></html>`;
}

export const ordersService = {
  async createOrder(payload: CreatePosOrderPayload): Promise<PosOrderResponse> {
    const { data } = await api.post<PosOrderResponse>("/orders/pos", payload);
    return data;
  },

  async getBestSellers(limit = 4): Promise<BestSellerItem[]> {
    const { data } = await api.get<BestSellerItem[]>("/orders/best-sellers", {
      params: { limit },
    });
    return data;
  },

  async getOrders(params?: { search?: string; status?: OrderStatus; customerId?: string }): Promise<OrderReadModel[]> {
    const { data } = await api.get<OrderReadModel[]>('/orders', { params });
    return data;
  },

  async getOrderById(id: string): Promise<OrderDetailReadModel> {
    // Avoid a browser/proxy 304 response without a response body when the
    // detail is requested for printing.
    const { data } = await api.get<OrderDetailReadModel>(`/orders/${id}`, {
      params: { _t: Date.now() },
      headers: { 'Cache-Control': 'no-cache' },
    });
    return data;
  },

  async completeOrder(id: string): Promise<void> {
    await api.patch(`/orders/${id}/complete`);
  },

  async cancelOrder(id: string): Promise<void> {
    await api.patch(`/orders/${id}/cancel`);
  },

  async deleteOrder(id: string): Promise<void> {
    await api.delete(`/orders/${id}`);
  },

  async openOrderReceiptPrint(order: OrderReadModel): Promise<void> {
    const detail = await this.getOrderById(order.id);
    const html = renderReceipt(order, detail);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    if (!printWindow) {
      throw new Error('Trình duyệt đã chặn cửa sổ in');
    }
  },
};
