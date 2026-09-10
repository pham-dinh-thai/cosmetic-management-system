import type { OrderReceipt } from '../../../application/use-cases/print-order/print-order.use-case';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatMoney(value: number): string {
  return value.toLocaleString('vi-VN');
}

function formatDate(value: Date | undefined): string {
  if (!value || Number.isNaN(new Date(value).getTime())) {
    return '-';
  }
  const date = new Date(value);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function paymentMethodLabel(paymentMethod: string): string {
  const labels: Record<string, string> = {
    CASH: 'Tiền mặt',
    BANK_TRANSFER: 'Chuyển khoản',
    CARD: 'Thẻ',
  };

  return labels[paymentMethod] ?? paymentMethod;
}

export function renderOrderReceiptHtml(receipt: OrderReceipt): string {
  const itemRows = receipt.lines
    .map(
      (line) => `
      <tr>
        <td colspan="4" class="item-name">${escapeHtml(line.name)}</td>
      </tr>
      <tr class="item-row">
        <td class="left">${formatMoney(line.unitPrice)}</td>
        <td class="center">${line.quantity}</td>
        <td class="center"></td>
        <td class="right">${formatMoney(line.subtotal)}</td>
      </tr>`,
    )
    .join('');

  const msch = '36366767';
  const nv = receipt.employeeCode ?? '-';
  const ptt = paymentMethodLabel(receipt.paymentMethod);
  const maCqt = 'M1-26-CPN7O-04138504425';

  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<title>Hóa đơn ${escapeHtml(receipt.code)}</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; background: #eee; color: #111; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; }
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
    width: 80mm;
    min-height: 120mm;
    margin: 0 auto;
    padding: 8mm 6mm;
    background: #fff;
  }
  @media screen { .receipt { margin-top: 16px; box-shadow: 0 2px 16px #bbb; } }
  
  .brand { text-align: center; font-size: 26px; font-weight: 800; margin-bottom: 2px; }
  .title { text-align: center; font-size: 14px; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.5px; }
  .info { text-align: center; font-size: 10px; line-height: 1.4; margin-bottom: 12px; }
  .divider { border-bottom: 1px dashed #000; margin: 6px 0; }
  
  .items-table { width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 6px; }
  .items-table th { padding: 4px 0; font-weight: 700; border-bottom: 1px dashed #000; }
  .items-table td { padding: 1px 0; }
  .items-table th.left, .items-table td.left { text-align: left; }
  .items-table th.center, .items-table td.center { text-align: center; }
  .items-table th.right, .items-table td.right { text-align: right; }
  .item-name { text-align: left; padding-top: 4px; padding-bottom: 1px; }
  .item-row td { padding-bottom: 4px; }

  .totals-table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 4px; }
  .totals-table td { padding: 3px 0; text-align: right; }
  .totals-table td.left { text-align: left; }
  .totals-table td.bold { font-weight: 700; }
  .totals-table .uppercase { text-transform: uppercase; }

  .qr-section { display: flex; align-items: center; margin: 12px 0 16px; font-size: 10px; gap: 8px; }
  .qr-code { width: 24mm; height: 24mm; flex-shrink: 0; border: 3px solid #111; background: repeating-conic-gradient(#111 0 25%, #fff 0 50%) 50% / 6px 6px; }
  .qr-text { text-align: justify; line-height: 1.4; flex: 1; }

  .barcode-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 4px; }
  .barcode { width: 80%; height: 12mm; background: repeating-linear-gradient(90deg, #111 0 1.5px, transparent 1.5px 3px, #111 3px 6px, transparent 6px 7.5px, #111 7.5px 9px, transparent 9px 12px, #111 12px 13.5px, transparent 13.5px 15px); margin: 0 auto; }
  
  .footer { display: flex; justify-content: space-between; align-items: center; font-size: 11px; margin-top: 4px; font-weight: 600; }
  .phone-icon { font-size: 12px; margin-right: 2px; }

  @media print { body { background: #fff; } .toolbar { display: none; } .receipt { box-shadow: none; margin: 0; padding: 0; } }
</style>
</head>
<body>
  <div class="toolbar">
    <button onclick="window.print()">In hóa đơn</button>
  </div>
  <main class="receipt">
    <div class="brand">Guardian</div>
    <div class="title">PHIẾU TÍNH TIỀN</div>
    <div class="info">
      ${formatDate(receipt.createdAt)}|MSCH:${msch}|NV:${nv}<br>
      PTT:${ptt}<br>
      Mã CQT: ${maCqt}
    </div>
    
    <table class="items-table">
      <thead>
        <tr>
          <th class="left" style="width: 45%">Mặt hàng/giá</th>
          <th class="center" style="width: 15%">SL</th>
          <th class="center" style="width: 15%">KM</th>
          <th class="right" style="width: 25%">T.Tiền</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
    </table>
    
    <div class="divider"></div>
    
    <table class="totals-table">
      <tr>
        <td class="left uppercase bold">TỔNG TIỀN</td>
        <td class="bold">${formatMoney(receipt.totalAmount)}</td>
      </tr>
      <tr>
        <td class="left">Tiền cần thanh toán</td>
        <td class="bold">${formatMoney(receipt.totalAmount)}</td>
      </tr>
    </table>
    
    <div class="divider"></div>
    
    <div class="qr-section">
      <div class="qr-code"></div>
      <div class="qr-text">
        Quét QR để xuất hóa đơn hoặc truy cập xuathoadon.guardian.vn trong 60 phút. Xin từ chối chịu trách nhiệm nếu nhập thông tin sai.
      </div>
    </div>
    
    <div class="barcode-section">
      <div class="barcode"></div>
    </div>
    
    <div class="footer">
      <div>Mã HĐ: ${escapeHtml(receipt.code)}</div>
      <div><span class="phone-icon">&#9742;</span> 2471066866-41791</div>
    </div>
  </main>
</body>
</html>`;
}