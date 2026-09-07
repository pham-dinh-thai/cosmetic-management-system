import type { PurchaseOrderReceipt } from '../../../application/use-cases/print-purchase-order/print-purchase-order.use-case';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Chờ nhập kho',
  COMPLETED: 'Đã nhập kho',
  CANCELLED: 'Đã hủy',
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatNumber(value: number): string {
  return value.toLocaleString('vi-VN');
}

function formatDate(value: Date | undefined): string {
  if (!value || Number.isNaN(new Date(value).getTime())) {
    return '-';
  }
  return new Date(value).toLocaleString('vi-VN');
}

export function renderPurchaseReceiptHtml(receipt: PurchaseOrderReceipt): string {
  const supplierAddress = receipt.supplierAddress
    ? `<div class="muted">${escapeHtml(receipt.supplierAddress)}</div>`
    : '';

  const lineRows = receipt.lines
    .map(
      (line, index) => `
      <tr>
        <td class="center">${index + 1}</td>
        <td>${escapeHtml(line.variantName)}</td>
        <td class="center">${line.quantity}</td>
        <td class="right">${formatNumber(line.unitPrice)}</td>
        <td class="right">${formatNumber(line.subtotal)}</td>
      </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <title>Phiếu nhập ${escapeHtml(receipt.code)}</title>
    <style>
      * { box-sizing: border-box; }
      body {
        font-family: 'Segoe UI', 'Arial', sans-serif;
        color: #1c3a13;
        margin: 0;
        padding: 0;
      }
      .toolbar {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding: 12px 24px;
        position: sticky;
        top: 0;
        background: #f4f6f1;
        border-bottom: 1px solid #dde3d6;
      }
      .toolbar button {
        font-family: inherit;
        font-size: 14px;
        padding: 8px 20px;
        border-radius: 8px;
        border: 1px solid #1c3a13;
        background: #1c3a13;
        color: #fff;
        cursor: pointer;
      }
      .receipt {
        max-width: 720px;
        margin: 0 auto;
        padding: 32px 24px 48px;
      }
      h1 { font-size: 24px; margin: 0 0 4px; }
      .subtitle { color: #666666; font-size: 13px; margin-bottom: 24px; }
      .meta {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        border: 1px solid #e4e7e0;
        border-radius: 12px;
        padding: 16px 20px;
        margin-bottom: 24px;
        font-size: 14px;
      }
      .meta .muted { color: #666666; }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
      }
      th, td { padding: 10px 12px; border-bottom: 1px solid #eef0ea; }
      thead th { background: #f4f6f1; text-align: left; }
      .center { text-align: center; }
      .right { text-align: right; font-variant-numeric: tabular-nums; }
      .muted { color: #666666; }
      .total {
        display: flex;
        justify-content: flex-end;
        align-items: baseline;
        gap: 12px;
        margin-top: 20px;
      }
      .total .label { font-size: 15px; }
      .total .value { font-size: 26px; font-weight: 700; }
      .footer { margin-top: 40px; text-align: center; color: #888888; font-size: 12px; }
      .badge {
        display: inline-block;
        padding: 3px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        background: #eef0ea;
        color: #666666;
      }
      @media print {
        .toolbar { display: none; }
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .receipt { padding: 8px; }
      }
    </style>
  </head>
  <body>
    <div class="toolbar">
      <button onclick="window.print()">In phiếu</button>
    </div>
    <div class="receipt">
      <h1>Phiếu nhập hàng</h1>
      <div class="subtitle">Mã phiếu: <strong>${escapeHtml(receipt.code)}</strong>
        &nbsp;•&nbsp; <span class="badge">${STATUS_LABEL[receipt.status] ?? receipt.status}</span></div>

      <div class="meta">
        <div>
          <div class="muted">Nhà cung cấp</div>
          <div><strong>${escapeHtml(receipt.supplierName)}</strong></div>
          ${supplierAddress}
        </div>
        <div class="right">
          <div class="muted">Ngày lập</div>
          <div><strong>${formatDate(receipt.createdAt)}</strong></div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th class="center" style="width: 40px">#</th>
            <th>Sản phẩm</th>
            <th class="center" style="width: 70px">SL</th>
            <th class="right" style="width: 110px">Đơn giá</th>
            <th class="right" style="width: 130px">Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${lineRows}
        </tbody>
      </table>

      <div class="total">
        <span class="label">Tổng tiền nhập:</span>
        <span class="value">${formatNumber(receipt.totalAmount)}₫</span>
      </div>

      <div class="footer">Phiếu nhập được in từ hệ thống quản lý mỹ phẩm.</div>
    </div>
  </body>
</html>`;
}