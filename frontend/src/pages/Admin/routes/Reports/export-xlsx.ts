import type { FullReportsData, ReportType } from "./type";

const HEADER_FILL = "FF1C3A13";
const SECTION_FILL = "FFE8F0E4";

type Sheet = {
  name: string;
  columns: { header: string; width: number; numFmt?: string }[];
  rows: (string | number | null)[][];
  sections?: { title: string; rows: (string | number | null)[][] }[];
};

function stamp(): string {
  return new Date().toISOString().slice(0, 10);
}

function fileName(type: ReportType): string {
  return `Bao_cao_${type}_${stamp()}.xlsx`;
}

function buildSheets(data: FullReportsData, type: ReportType): Sheet[] {
  const VND = "#,##0";

  if (type === "revenue") {
    const s = data.revenue.summary;
    return [
      {
        name: "Tổng quan",
        columns: [
          { header: "Chỉ số", width: 42 },
          { header: "Giá trị", width: 22 },
        ],
        rows: [
          ["Tổng doanh thu thực tế (VNĐ)", s.totalRevenue],
          ["Lợi nhuận gộp ước tính (VNĐ)", s.estimatedProfit],
          ["Tổng số đơn phát sinh", s.totalOrders],
          ["Số đơn hoàn thành", s.completedOrders],
          ["Số đơn đã huỷ", s.cancelledOrders],
          ["Tỉ lệ hoàn thành (%)", Number(s.completionRate.toFixed(1))],
          ["Giá trị đơn trung bình (VNĐ)", s.avgOrderValue],
          ["Tổng sản phẩm bán ra", s.totalProductsSold],
        ],
      },
      {
        name: "Đơn hàng",
        columns: [
          { header: "Mã đơn", width: 14 },
          { header: "Khách hàng", width: 26 },
          { header: "Ngày tạo", width: 20 },
          { header: "Phương thức", width: 16 },
          { header: "TT Thanh toán", width: 16 },
          { header: "TT Đơn hàng", width: 16 },
          { header: "Doanh thu (VNĐ)", width: 18, numFmt: VND },
          { header: "Lợi nhuận (VNĐ)", width: 18, numFmt: VND },
        ],
        rows: data.revenue.orders.map((o) => [
          o.code,
          o.customerName,
          new Date(o.createdAt).toLocaleString("vi-VN"),
          o.paymentMethod,
          o.paymentStatus,
          o.status,
          o.totalAmount,
          o.profit,
        ]),
      },
      {
        name: "Sản phẩm bán chạy",
        columns: [
          { header: "Mã SP", width: 14 },
          { header: "Tên sản phẩm", width: 32 },
          { header: "Phân loại", width: 22 },
          { header: "Danh mục", width: 20 },
          { header: "Số lượng bán", width: 14 },
          { header: "Doanh thu (VNĐ)", width: 18, numFmt: VND },
          { header: "Lợi nhuận (VNĐ)", width: 18, numFmt: VND },
        ],
        rows: data.revenue.topProducts.map((p) => [
          p.code,
          p.name,
          p.variantName,
          p.categoryName,
          p.quantitySold,
          p.revenue,
          p.profit,
        ]),
      },
    ];
  }

  if (type === "inventory") {
    const s = data.inventory.summary;
    return [
      {
        name: "Tổng quan",
        columns: [
          { header: "Chỉ số", width: 42 },
          { header: "Giá trị", width: 22 },
        ],
        rows: [
          ["Tổng số mặt hàng phân loại", s.totalItems],
          ["Tổng số đơn vị tồn kho", s.totalUnits],
          ["Tổng giá trị vốn tồn kho (VNĐ)", s.totalInventoryValue],
          ["Số mặt hàng sắp hết", s.lowStockCount],
          ["Số mặt hàng hết hàng", s.outOfStockCount],
        ],
      },
      {
        name: "Chi tiết tồn kho",
        columns: [
          { header: "Mã SP", width: 14 },
          { header: "Tên sản phẩm", width: 32 },
          { header: "Phân loại", width: 22 },
          { header: "Giá vốn (VNĐ)", width: 16, numFmt: VND },
          { header: "Giá bán (VNĐ)", width: 16, numFmt: VND },
          { header: "Tồn kho", width: 12 },
          { header: "Mức tối thiểu", width: 15 },
          { header: "Tổng giá trị vốn (VNĐ)", width: 22, numFmt: VND },
          { header: "Tình trạng", width: 16 },
        ],
        rows: data.inventory.items.map((i) => [
          i.code,
          i.name,
          i.variantName,
          i.costPrice,
          i.price,
          i.quantity,
          i.minStock,
          i.totalValue,
          i.status === "OUT_OF_STOCK"
            ? "Hết hàng"
            : i.status === "LOW_STOCK"
              ? "Sắp hết hàng"
              : "Đủ hàng",
        ]),
      },
    ];
  }

  const s = data.customer.summary;
  return [
    {
      name: "Tổng quan",
      columns: [
        { header: "Chỉ số", width: 42 },
        { header: "Giá trị", width: 22 },
      ],
      rows: [
        ["Tổng số khách hàng", s.totalCustomers],
        ["Khách hàng đang hoạt động", s.activeCustomers],
        ["Khách hàng đã phát sinh mua hàng", s.buyingCustomers],
        ["Chi tiêu trung bình/khách mua (VNĐ)", s.avgSpendPerCustomer],
        ["Khách chi tiêu cao nhất", s.topSpenderName],
        ["Tổng chi tiêu của khách đó (VNĐ)", s.topSpenderAmount],
      ],
    },
    {
      name: "Xếp hạng doanh số",
      columns: [
        { header: "Mã KH", width: 14 },
        { header: "Họ tên khách hàng", width: 28 },
        { header: "Email", width: 30 },
        { header: "Số điện thoại", width: 16 },
        { header: "Số đơn đã mua", width: 15 },
        { header: "Tổng chi tiêu (VNĐ)", width: 20, numFmt: VND },
        { header: "Đơn gần nhất", width: 18 },
        { header: "Trạng thái", width: 14 },
      ],
      rows: data.customer.customers.map((c) => [
        c.code,
        c.name,
        c.email,
        c.phone,
        c.ordersCount,
        c.totalSpend,
        c.lastOrderDate
          ? new Date(c.lastOrderDate).toLocaleDateString("vi-VN")
          : "Chưa có",
        c.isActive ? "Hoạt động" : "Khóa",
      ]),
    },
  ];
}

function fillSheet(wb: import("exceljs").Workbook, sheet: Sheet) {
  const ws = wb.addWorksheet(sheet.name);
  const cols = sheet.columns.length;

  ws.addRow(sheet.columns.map((c) => c.header));
  const header = ws.getRow(1);
  header.font = { bold: true, color: { argb: "FFFFFFFF" } };
  header.fill = { type: "pattern", pattern: "solid", fgColor: { argb: HEADER_FILL } };
  header.height = 20;

  sheet.columns.forEach((c, i) => {
    ws.getColumn(i + 1).width = c.width;
    if (c.numFmt) ws.getColumn(i + 1).numFmt = c.numFmt;
  });

  sheet.rows.forEach((row) => {
    if (row.length < cols) return;
    ws.addRow(row);
  });

  sheet.sections?.forEach((section) => {
    ws.addRow([]);
    const titleRow = ws.addRow([section.title]);
    titleRow.font = { bold: true };
    titleRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: SECTION_FILL },
    };
    section.rows.forEach((row) => {
      if (row.length < cols) return;
      ws.addRow(row);
    });
  });

  if (sheet.rows.length) {
    ws.views = [{ state: "frozen", ySplit: 1 }];
  }
  return ws;
}

export async function exportXlsx(data: FullReportsData, type: ReportType) {
  type ExcelJS = typeof import("exceljs");
  const mod = (await import("exceljs")) as ExcelJS & { default?: ExcelJS };

  const wb = new (mod.default ?? mod).Workbook();
  wb.creator = "GUARDIAN";
  wb.created = new Date();

  for (const sheet of buildSheets(data, type)) {
    fillSheet(wb, sheet);
  }

  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName(type);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}