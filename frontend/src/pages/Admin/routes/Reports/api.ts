import api from "../../../../config/axios";
import { productsService, type CosmeticDetail } from "../../../../services/products.service";
import { customersService } from "../../../../services/customers.service";
import { inventoryApi } from "../Inventory/api";
import type {
  TimeRangeOption,
  ReportType,
  FullReportsData,
  RevenueReportSummary,
  RevenueOrderRow,
  TopProductRow,
  InventoryReportSummary,
  InventoryReportRow,
  CustomerReportSummary,
  CustomerReportRow,
  TimelinePoint,
  RevenueTimelines,
  OrderStatusDonut,
} from "./type";

export interface RawOrder {
  id: string;
  code: string;
  customerId: string | null;
  status: string;
  paymentStatus?: string;
  paymentMethod?: string;
  totalAmount: number;
  createdAt: string;
}

export interface RawOrderLine {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface RawOrderDetail extends RawOrder {
  lines: RawOrderLine[];
}

export const reportsApi = {
  fetchFullReports: async (timeRange: TimeRangeOption = "30"): Promise<FullReportsData> => {
    // 1. Fetch Orders, Cosmetics, Categories, Inventories, Customers in parallel
    const [ordersRes, cosmeticsListRes, categoriesRes, inventoryItems, customersRes] =
      await Promise.all([
        api.get<RawOrder[]>("/orders").then((r) => r.data).catch(() => []),
        productsService.getCosmetics().catch(() => []),
        api.get<{ id: string; name: string }[]>("/categories").then((r) => r.data).catch(() => []),
        inventoryApi.fetchInventory().catch(() => []),
        customersService.getCustomers().catch(() => []),
      ]);

    // 2. Fetch cosmetic details
    const cosmeticDetails = await Promise.all(
      cosmeticsListRes.map((c) => productsService.getCosmeticById(c.id).catch(() => null)),
    );
    const validCosmetics = cosmeticDetails.filter((c): c is CosmeticDetail => c !== null);

    const categoryMap = new Map<string, string>();
    categoriesRes.forEach((cat) => categoryMap.set(cat.id, cat.name));

    interface VariantMeta {
      cosmeticCode: string;
      cosmeticName: string;
      variantName: string;
      price: number;
      costPrice: number;
      categoryName: string;
    }
    const variantMap = new Map<string, VariantMeta>();

    for (const c of validCosmetics) {
      const primaryCatName =
        c.categoryIds && c.categoryIds.length > 0
          ? categoryMap.get(c.categoryIds[0]) || "Khác"
          : "Khác";

      for (const v of c.variants) {
        variantMap.set(v.id, {
          cosmeticCode: c.code,
          cosmeticName: c.name,
          variantName: v.name,
          price: Number(v.price) || 0,
          costPrice: Number(v.costPrice) || 0,
          categoryName: primaryCatName,
        });
      }
    }

    // 3. Customer Map
    const customerMap = new Map<string, { code: string; name: string; email: string; phone: string; isActive: boolean }>();
    customersRes.forEach((c) => {
      customerMap.set(c.id, {
        code: c.code,
        name: c.name,
        email: c.email || "—",
        phone: c.phone || "—",
        isActive: c.isActive ?? true,
      });
    });

    // 4. Time filtering for orders
    const now = new Date();
    let startDate: Date | null = null;
    if (timeRange === "7") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeRange === "30") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (timeRange === "90") {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    } else if (timeRange === "365") {
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }

    const filteredOrders = ordersRes.filter((o) => {
      if (!startDate) return true;
      return new Date(o.createdAt).getTime() >= startDate.getTime();
    });

    const completedOrdersList = filteredOrders.filter(
      (o) => o.status === "DELIVERED" || o.paymentStatus === "PAID",
    );
    const cancelledOrdersList = filteredOrders.filter((o) => o.status === "CANCELLED");

    // Fetch detail lines for completed orders
    const completedDetails = await Promise.all(
      completedOrdersList.map((o) =>
        api.get<RawOrderDetail>(`/orders/${o.id}`).then((r) => r.data).catch(() => null),
      ),
    );
    const validDetails = completedDetails.filter((d): d is RawOrderDetail => d !== null);

    const orderProfitMap = new Map<string, number>();
    const variantSalesMap = new Map<string, { quantity: number; revenue: number; profit: number }>();
    let totalProductsSold = 0;
    let totalEstimatedProfit = 0;

    for (const detail of validDetails) {
      let orderProfit = 0;
      for (const line of detail.lines || []) {
        const qty = line.quantity || 1;
        const lineRev = Number(line.subtotal) || Number(line.unitPrice) * qty || 0;
        const meta = variantMap.get(line.variantId);
        const cost = meta ? meta.costPrice * qty : 0;
        const profit = Math.max(lineRev - cost, 0);

        orderProfit += profit;
        totalProductsSold += qty;
        totalEstimatedProfit += profit;

        const prev = variantSalesMap.get(line.variantId) || { quantity: 0, revenue: 0, profit: 0 };
        variantSalesMap.set(line.variantId, {
          quantity: prev.quantity + qty,
          revenue: prev.revenue + lineRev,
          profit: prev.profit + profit,
        });
      }
      orderProfitMap.set(detail.id, orderProfit);
    }

    const totalRevenue = completedOrdersList.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);
    const totalOrders = filteredOrders.length;
    const completedOrders = completedOrdersList.length;
    const cancelledOrders = cancelledOrdersList.length;
    const completionRate = totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0;
    const avgOrderValue = completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0;

    const revenueSummary: RevenueReportSummary = {
      totalRevenue,
      totalOrders,
      completedOrders,
      cancelledOrders,
      completionRate,
      avgOrderValue,
      estimatedProfit: totalEstimatedProfit,
      totalProductsSold,
    };

    // ==========================================
    // Revenue Timelines: 7d, month (Tháng 1..12), quarter (Quý 1..4), year (5 năm)
    // ==========================================
    const toDateKey = (d: Date) => d.toISOString().slice(0, 10);
    const VN_DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const currentYear = now.getFullYear();

    // 1. 7 ngày gần nhất
    const timeline7d: TimelinePoint[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = toDateKey(d);
      const label = `${VN_DAYS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`;
      timeline7d.push({ key, label, revenue: 0, ordersCount: 0 });
    }

    // 2. Theo tháng: Tháng 1, Tháng 2, ..., Tháng 12 của năm hiện tại
    const timelineMonth: TimelinePoint[] = [];
    for (let m = 1; m <= 12; m++) {
      timelineMonth.push({
        key: `thang-${m}`,
        label: `Tháng ${m}`,
        revenue: 0,
        ordersCount: 0,
      });
    }

    // 3. Theo quý: Quý 1, Quý 2, Quý 3, Quý 4 của năm hiện tại
    const timelineQuarter: TimelinePoint[] = [
      { key: "quy-1", label: "Quý 1", revenue: 0, ordersCount: 0 },
      { key: "quy-2", label: "Quý 2", revenue: 0, ordersCount: 0 },
      { key: "quy-3", label: "Quý 3", revenue: 0, ordersCount: 0 },
      { key: "quy-4", label: "Quý 4", revenue: 0, ordersCount: 0 },
    ];

    // 4. Theo năm: 5 năm trước đến năm hiện tại (mốc cuối là năm hiện tại)
    const timelineYear: TimelinePoint[] = [];
    for (let y = currentYear - 4; y <= currentYear; y++) {
      timelineYear.push({
        key: `nam-${y}`,
        label: `${y}`,
        revenue: 0,
        ordersCount: 0,
      });
    }

    // Lấy tất cả đơn hoàn thành/đã thanh toán trong hệ thống để tính đúng chu kỳ năm/quý/tháng
    const allCompletedOrders = ordersRes.filter(
      (o) => o.status === "DELIVERED" || o.paymentStatus === "PAID",
    );

    // Điền dữ liệu vào các biểu đồ
    for (const o of allCompletedOrders) {
      const oDate = new Date(o.createdAt);
      const oAmount = Number(o.totalAmount || 0);
      const oKey = toDateKey(oDate);
      const oYear = oDate.getFullYear();
      const oMonth = oDate.getMonth() + 1; // 1 to 12

      // 7 ngày gần nhất
      const p7 = timeline7d.find((p) => p.key === oKey);
      if (p7) {
        p7.revenue += oAmount;
        p7.ordersCount++;
      }

      // Theo tháng (của năm hiện tại: Tháng 1 đến Tháng 12)
      if (oYear === currentYear && oMonth >= 1 && oMonth <= 12) {
        const pm = timelineMonth[oMonth - 1];
        if (pm) {
          pm.revenue += oAmount;
          pm.ordersCount++;
        }

        // Theo quý (của năm hiện tại: Quý 1, Quý 2, Quý 3, Quý 4)
        const qIdx = Math.floor((oMonth - 1) / 3);
        if (qIdx >= 0 && qIdx < 4) {
          timelineQuarter[qIdx].revenue += oAmount;
          timelineQuarter[qIdx].ordersCount++;
        }
      }

      // Theo năm (5 năm gần nhất: currentYear - 4 đến currentYear)
      const py = timelineYear.find((p) => p.key === `nam-${oYear}`);
      if (py) {
        py.revenue += oAmount;
        py.ordersCount++;
      }
    }

    const timelines: RevenueTimelines = {
      "7d": timeline7d,
      month: timelineMonth,
      quarter: timelineQuarter,
      year: timelineYear,
    };

    // Donut data: Completed vs Cancelled
    const completedCount = completedOrdersList.length;
    const cancelledCount = cancelledOrdersList.length;
    const otherCount = Math.max(0, totalOrders - completedCount - cancelledCount);
    const completedPercent = totalOrders > 0 ? (completedCount / totalOrders) * 100 : 0;
    const cancelledPercent = totalOrders > 0 ? (cancelledCount / totalOrders) * 100 : 0;
    const otherPercent = totalOrders > 0 ? (otherCount / totalOrders) * 100 : 0;

    const donut: OrderStatusDonut = {
      completedCount,
      cancelledCount,
      otherCount,
      totalCount: totalOrders,
      completedPercent,
      cancelledPercent,
      otherPercent,
    };

    const revenueOrders: RevenueOrderRow[] = filteredOrders.map((o) => {
      const cust = o.customerId ? customerMap.get(o.customerId) : null;
      return {
        id: o.id,
        code: o.code,
        customerName: cust ? cust.name : "Khách vãng lai / POS",
        createdAt: o.createdAt,
        paymentMethod: o.paymentMethod || "CASH",
        paymentStatus: o.paymentStatus || "UNPAID",
        status: o.status,
        totalAmount: Number(o.totalAmount || 0),
        profit: orderProfitMap.get(o.id) || 0,
      };
    });

    const topProducts: TopProductRow[] = [...variantSalesMap.entries()]
      .map(([variantId, stats]) => {
        const meta = variantMap.get(variantId);
        return {
          code: meta?.cosmeticCode || "—",
          name: meta?.cosmeticName || "Sản phẩm",
          variantName: meta?.variantName || "Mặc định",
          categoryName: meta?.categoryName || "Khác",
          quantitySold: stats.quantity,
          revenue: stats.revenue,
          profit: stats.profit,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 15);

    // ==========================================
    // 5. Inventory Report Calculation
    // ==========================================
    let totalInventoryValue = 0;
    let totalStockUnits = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    const inventoryRows: InventoryReportRow[] = inventoryItems.map((inv) => {
      const meta = variantMap.get(inv.variantId);
      const qty = inv.quantity || 0;
      const min = inv.minStock || 0;
      const cost = meta ? meta.costPrice : 0;
      const itemVal = qty * cost;

      totalStockUnits += qty;
      totalInventoryValue += itemVal;

      let status: InventoryReportRow["status"] = "IN_STOCK";
      if (qty === 0) {
        status = "OUT_OF_STOCK";
        outOfStockCount++;
      } else if (qty <= min || qty <= 20) {
        status = "LOW_STOCK";
        lowStockCount++;
      }

      return {
        id: inv.id,
        code: meta?.cosmeticCode || "—",
        name: meta?.cosmeticName || `Biến thể ${inv.variantId.slice(0, 8)}`,
        variantName: meta?.variantName || "",
        costPrice: cost,
        price: meta?.price || 0,
        quantity: qty,
        minStock: min,
        totalValue: itemVal,
        status,
      };
    });

    const inventorySummary: InventoryReportSummary = {
      totalItems: inventoryRows.length,
      totalUnits: totalStockUnits,
      totalInventoryValue,
      lowStockCount,
      outOfStockCount,
    };

    // ==========================================
    // 6. Customer Report Calculation
    // ==========================================
    const customerOrdersCount = new Map<string, { count: number; spend: number; lastDate: string | null }>();
    for (const order of filteredOrders) {
      if (!order.customerId) continue;
      const prev = customerOrdersCount.get(order.customerId) || { count: 0, spend: 0, lastDate: null };
      const isPaid = order.status === "DELIVERED" || order.paymentStatus === "PAID";
      const spendAdd = isPaid ? Number(order.totalAmount || 0) : 0;
      const orderDate = order.createdAt;

      customerOrdersCount.set(order.customerId, {
        count: prev.count + 1,
        spend: prev.spend + spendAdd,
        lastDate:
          !prev.lastDate || new Date(orderDate).getTime() > new Date(prev.lastDate).getTime()
            ? orderDate
            : prev.lastDate,
      });
    }

    let topSpenderName = "—";
    let topSpenderAmount = 0;
    let totalCustomerSpend = 0;
    let buyingCustomersCount = 0;

    const customerRows: CustomerReportRow[] = customersRes.map((c) => {
      const stats = customerOrdersCount.get(c.id) || { count: 0, spend: 0, lastDate: null };
      if (stats.count > 0) buyingCustomersCount++;
      totalCustomerSpend += stats.spend;

      if (stats.spend > topSpenderAmount) {
        topSpenderAmount = stats.spend;
        topSpenderName = c.name;
      }

      return {
        id: c.id,
        code: c.code,
        name: c.name,
        email: c.email || "—",
        phone: c.phone || "—",
        ordersCount: stats.count,
        totalSpend: stats.spend,
        lastOrderDate: stats.lastDate,
        isActive: c.isActive ?? true,
      };
    }).sort((a, b) => b.totalSpend - a.totalSpend);

    const activeCustomers = customersRes.filter((c) => c.isActive ?? true).length;
    const avgSpendPerCustomer =
      buyingCustomersCount > 0 ? Math.round(totalCustomerSpend / buyingCustomersCount) : 0;

    const customerSummary: CustomerReportSummary = {
      totalCustomers: customersRes.length,
      activeCustomers,
      buyingCustomers: buyingCustomersCount,
      avgSpendPerCustomer,
      topSpenderName,
      topSpenderAmount,
    };

    return {
      timeRange,
      reportType: "revenue",
      revenue: {
        summary: revenueSummary,
        timelines,
        donut,
        orders: revenueOrders,
        topProducts,
      },
      inventory: {
        summary: inventorySummary,
        items: inventoryRows,
      },
      customer: {
        summary: customerSummary,
        customers: customerRows,
      },
    };
  },

  exportCsv: (data: FullReportsData, currentType: ReportType) => {
    const lines: string[] = [];
    const dateStr = new Date().toISOString().slice(0, 10);
    const fileName = `Bao_cao_${currentType}_${dateStr}.csv`;

    if (currentType === "revenue") {
      lines.push("BÁO CÁO DOANH THU & BÁN HÀNG - GUARDIAN");
      lines.push(`Thời gian trích xuất,${new Date().toLocaleString("vi-VN")}`);
      lines.push(`Kỳ báo cáo,${data.timeRange} ngày gần nhất`);
      lines.push("");
      lines.push("--- TỔNG QUAN CHỈ SỐ DOANH THU ---");
      lines.push(`Tổng doanh thu thực tế (VNĐ),${data.revenue.summary.totalRevenue}`);
      lines.push(`Lợi nhuận gộp ước tính (VNĐ),${data.revenue.summary.estimatedProfit}`);
      lines.push(`Tổng số đơn phát sinh,${data.revenue.summary.totalOrders}`);
      lines.push(`Số đơn hoàn thành,${data.revenue.summary.completedOrders}`);
      lines.push(`Tỉ lệ hoàn thành,${data.revenue.summary.completionRate.toFixed(1)}%`);
      lines.push(`Giá trị đơn trung bình (VNĐ),${data.revenue.summary.avgOrderValue}`);
      lines.push(`Tổng sản phẩm bán ra,${data.revenue.summary.totalProductsSold}`);
      lines.push("");

      lines.push("--- DANH SÁCH ĐƠN HÀNG TRONG KỲ ---");
      lines.push("Mã đơn,Khách hàng,Ngày tạo,Phương thức,TT Thanh toán,TT Đơn hàng,Doanh thu (VNĐ),Lợi nhuận (VNĐ)");
      data.revenue.orders.forEach((o) => {
        lines.push(
          `"${o.code}","${o.customerName}","${new Date(o.createdAt).toLocaleString("vi-VN")}","${o.paymentMethod}","${o.paymentStatus}","${o.status}",${o.totalAmount},${o.profit}`,
        );
      });
      lines.push("");

      lines.push("--- TOP SẢN PHẨM BÁN CHẠY NHẤT ---");
      lines.push("Mã SP,Tên sản phẩm,Phân loại,Danh mục,Số lượng bán,Doanh thu (VNĐ),Lợi nhuận (VNĐ)");
      data.revenue.topProducts.forEach((p) => {
        lines.push(
          `"${p.code}","${p.name.replace(/"/g, '""')}","${p.variantName}","${p.categoryName}",${p.quantitySold},${p.revenue},${p.profit}`,
        );
      });
    } else if (currentType === "inventory") {
      lines.push("BÁO CÁO TỒN KHO & ĐỊNH GIÁ HÀNG HÓA - GUARDIAN");
      lines.push(`Thời gian trích xuất,${new Date().toLocaleString("vi-VN")}`);
      lines.push("");
      lines.push("--- TỔNG QUAN CHỈ SỐ TỒN KHO ---");
      lines.push(`Tổng số mặt hàng phân loại,${data.inventory.summary.totalItems}`);
      lines.push(`Tổng số đơn vị tồn kho,${data.inventory.summary.totalUnits}`);
      lines.push(`Tổng giá trị vốn tồn kho (VNĐ),${data.inventory.summary.totalInventoryValue}`);
      lines.push(`Số mặt hàng sắp hết,${data.inventory.summary.lowStockCount}`);
      lines.push(`Số mặt hàng hết hàng,${data.inventory.summary.outOfStockCount}`);
      lines.push("");

      lines.push("--- BẢNG CHI TIẾT TỒN KHO THEO MẶT HÀNG ---");
      lines.push("Mã SP,Tên sản phẩm,Phân loại,Giá vốn (VNĐ),Giá bán (VNĐ),Tồn kho,Mức tối thiểu,Tổng giá trị vốn (VNĐ),Tình trạng");
      data.inventory.items.forEach((item) => {
        const stText =
          item.status === "OUT_OF_STOCK"
            ? "Hết hàng"
            : item.status === "LOW_STOCK"
              ? "Sắp hết hàng"
              : "Đủ hàng";
        lines.push(
          `"${item.code}","${item.name.replace(/"/g, '""')}","${item.variantName}",${item.costPrice},${item.price},${item.quantity},${item.minStock},${item.totalValue},"${stText}"`,
        );
      });
    } else if (currentType === "customer") {
      lines.push("BÁO CÁO KHÁCH HÀNG & DOANH SỐ - GUARDIAN");
      lines.push(`Thời gian trích xuất,${new Date().toLocaleString("vi-VN")}`);
      lines.push("");
      lines.push("--- TỔNG QUAN CHỈ SỐ KHÁCH HÀNG ---");
      lines.push(`Tổng số khách hàng,${data.customer.summary.totalCustomers}`);
      lines.push(`Khách hàng đang hoạt động,${data.customer.summary.activeCustomers}`);
      lines.push(`Khách hàng đã phát sinh mua hàng,${data.customer.summary.buyingCustomers}`);
      lines.push(`Chi tiêu trung bình/khách mua (VNĐ),${data.customer.summary.avgSpendPerCustomer}`);
      lines.push(`Khách hàng chi tiêu cao nhất,"${data.customer.summary.topSpenderName}" (${data.customer.summary.topSpenderAmount} VNĐ)`);
      lines.push("");

      lines.push("--- BẢNG XẾP HẠNG DOANH SỐ THEO KHÁCH HÀNG ---");
      lines.push("Mã KH,Họ tên khách hàng,Email,Số điện thoại,Số đơn đã mua,Tổng chi tiêu (VNĐ),Đơn gần nhất,Trạng thái");
      data.customer.customers.forEach((c) => {
        lines.push(
          `"${c.code}","${c.name}","${c.email}","${c.phone}",${c.ordersCount},${c.totalSpend},"${c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString("vi-VN") : "Chưa có"}","${c.isActive ? "Hoạt động" : "Khóa"}"`,
        );
      });
    }

    const csvContent = "\uFEFF" + lines.join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
