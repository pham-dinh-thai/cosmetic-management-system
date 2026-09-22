export type TimeRangeOption = "7" | "30" | "90" | "365" | "all";
export type ReportType = "revenue" | "inventory" | "customer";
export type RevenueChartMode = "7d" | "month" | "quarter" | "year";

export interface TimelinePoint {
  key: string;
  label: string;
  revenue: number;
  ordersCount: number;
}

export interface RevenueTimelines {
  "7d": TimelinePoint[];
  month: TimelinePoint[];
  quarter: TimelinePoint[];
  year: TimelinePoint[];
}

export interface OrderStatusDonut {
  completedCount: number;
  cancelledCount: number;
  otherCount: number;
  totalCount: number;
  completedPercent: number;
  cancelledPercent: number;
  otherPercent: number;
}

// 1. Revenue Report
export interface RevenueReportSummary {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  completionRate: number;
  avgOrderValue: number;
  estimatedProfit: number;
  totalProductsSold: number;
}

export interface RevenueOrderRow {
  id: string;
  code: string;
  customerName: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  totalAmount: number;
  profit: number;
}

export interface TopProductRow {
  code: string;
  name: string;
  variantName: string;
  categoryName: string;
  quantitySold: number;
  revenue: number;
  profit: number;
}

// 2. Inventory Report
export interface InventoryReportSummary {
  totalItems: number;
  totalUnits: number;
  totalInventoryValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface InventoryReportRow {
  id: string;
  code: string;
  name: string;
  variantName: string;
  costPrice: number;
  price: number;
  quantity: number;
  minStock: number;
  totalValue: number; // quantity * costPrice
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

// 3. Customer Report
export interface CustomerReportSummary {
  totalCustomers: number;
  activeCustomers: number;
  buyingCustomers: number;
  avgSpendPerCustomer: number;
  topSpenderName: string;
  topSpenderAmount: number;
}

export interface CustomerReportRow {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpend: number;
  lastOrderDate: string | null;
  isActive: boolean;
}

// Combined Reports Data
export interface FullReportsData {
  timeRange: TimeRangeOption;
  reportType: ReportType;
  revenue: {
    summary: RevenueReportSummary;
    timelines: RevenueTimelines;
    donut: OrderStatusDonut;
    orders: RevenueOrderRow[];
    topProducts: TopProductRow[];
  };
  inventory: {
    summary: InventoryReportSummary;
    items: InventoryReportRow[];
  };
  customer: {
    summary: CustomerReportSummary;
    customers: CustomerReportRow[];
  };
}
