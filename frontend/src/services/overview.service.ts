import api from "../config/axios";

export interface Order {
  id: string;
  code: string;
  customerId: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export interface OrderTransaction {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  employeeId: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  variantId: string;
  quantity: number;
  lastUpdatedAt: string;
  createdAt?: string;
  updatedAt?: string;
  expiryDate?: string;
}

export interface CosmeticVariant {
  id: string;
  name: string;
  color: string | null;
  volume: string | null;
  price: number;
  costPrice: number | null;
  isActive: boolean;
}

export interface CosmeticDetail {
  id: string;
  code: string;
  name: string;
  brand: string | null;
  origin: string | null;
  description: string | null;
  imageUrl: string | null;
  variants: CosmeticVariant[];
  categoryIds: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TopProduct {
  code: string;
  name: string;
  variantName: string;
  sold: number;
  revenue: number;
}

export interface OverviewData {
  revenueToday: number;
  revenueYesterday: number;
  ordersToday: number;
  ordersYesterday: number;
  revenueThisMonth: number;
  revenueLastMonth: number;
  totalStockUnits: number;
  lowStockCount: number;
  outOfStockCount: number;
  revenueByDay: { key: string; label: string; value: number }[];
  topProducts: TopProduct[];
  orderStatusCounts: { status: string; label: string; count: number }[];
}

const VN_DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function isSameMonth(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
  );
}

function daysAgo(days: number, base: Date = new Date()): Date {
  const d = new Date(base);
  d.setDate(d.getDate() - days);
  return d;
}

export const overviewService = {
  async getOrders(): Promise<Order[]> {
    const { data } = await api.get<Order[]>("/orders");
    return data;
  },

  async getTransactions(): Promise<OrderTransaction[]> {
    const { data } = await api.get<OrderTransaction[]>("/orders/transactions");
    return data;
  },

  async getInventory(): Promise<InventoryItem[]> {
    const { data } = await api.get<InventoryItem[]>("/inventory");
    return data;
  },

  async getCosmeticDetails(): Promise<CosmeticDetail[]> {
    const { data } = await api.get<{ id: string }[]>("/cosmetics");
    const details = await Promise.all(
      data.map((cosmetic) =>
        api.get<CosmeticDetail | null>(`/cosmetics/${cosmetic.id}`),
      ),
    );
    return details
      .map(({ data: detail }) => detail)
      .filter((d): d is CosmeticDetail => d !== null);
  },

  async fetchOverview(): Promise<OverviewData> {
    const [transactions, orders, inventory, cosmetics] = await Promise.all([
      this.getTransactions(),
      this.getOrders(),
      this.getInventory(),
      this.getCosmeticDetails(),
    ]);

    const now = new Date();
    const todayStart = startOfDay(now);
    const yesterdayStart = startOfDay(daysAgo(1, now));

    const sumRange = (items: { createdAt: string; subtotal: number }[], start: Date, end: Date) =>
      items
        .filter(
          (item) =>
            new Date(item.createdAt).getTime() >= start.getTime() &&
            new Date(item.createdAt).getTime() < end.getTime(),
        )
        .reduce((sum, item) => sum + item.subtotal, 0);

    const revenueToday = transactions
      .filter((t) => isSameDay(new Date(t.createdAt), now))
      .reduce((sum, t) => sum + t.subtotal, 0);

    const revenueYesterday = sumRange(transactions, yesterdayStart, todayStart);

    const ordersToday = orders.filter((o) =>
      isSameDay(new Date(o.createdAt), now),
    ).length;

    const ordersYesterday = orders.filter(
      (o) =>
        new Date(o.createdAt).getTime() >= yesterdayStart.getTime() &&
        new Date(o.createdAt).getTime() < todayStart.getTime(),
    ).length;

    const revenueThisMonth = transactions
      .filter((t) => isSameMonth(new Date(t.createdAt), now))
      .reduce((sum, t) => sum + t.subtotal, 0);

    const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const revenueLastMonth = transactions
      .filter((t) => isSameMonth(new Date(t.createdAt), prevMonth))
      .reduce((sum, t) => sum + t.subtotal, 0);

    const totalStockUnits = inventory.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );
    const lowStockCount = inventory.filter(
      (item) => item.quantity > 0 && item.quantity <= 20,
    ).length;
    const outOfStockCount = inventory.filter((item) => item.quantity === 0)
      .length;

    const revenueByDay: OverviewData["revenueByDay"] = [];
    for (let i = 6; i >= 0; i--) {
      const day = daysAgo(i, now);
      const value = transactions
        .filter((t) => isSameDay(new Date(t.createdAt), day))
        .reduce((sum, t) => sum + t.subtotal, 0);
      revenueByDay.push({
        key: day.toISOString().slice(0, 10),
        label: VN_DAYS[day.getDay()],
        value,
      });
    }

    const cosmeticByVariant = new Map<string, { code: string; name: string; variantName: string }>();
    for (const cosmetic of cosmetics) {
      for (const variant of cosmetic.variants) {
        cosmeticByVariant.set(variant.id, {
          code: cosmetic.code,
          name: cosmetic.name,
          variantName: variant.name,
        });
      }
    }

    const byVariant = new Map<
      string,
      { quantity: number; subtotal: number }
    >();
    for (const t of transactions) {
      const current = byVariant.get(t.variantId) ?? {
        quantity: 0,
        subtotal: 0,
      };
      current.quantity += t.quantity;
      current.subtotal += t.subtotal;
      byVariant.set(t.variantId, current);
    }

    const topProducts: TopProduct[] = [...byVariant.entries()]
      .sort((a, b) => b[1].quantity - a[1].quantity)
      .slice(0, 5)
      .map(([variantId, stats]) => {
        const product = cosmeticByVariant.get(variantId);
        return {
          code: product?.code ?? "N/A",
          name: product?.name ?? "Sản phẩm không xác định",
          variantName: product?.variantName ?? "",
          sold: stats.quantity,
          revenue: stats.subtotal,
        };
      });

    const orderStatusCounts = [
      {
        status: "PENDING",
        label: "Chờ xử lý",
        count: orders.filter((o) => o.status === "PENDING").length,
      },
      {
        status: "COMPLETED",
        label: "Hoàn thành",
        count: orders.filter((o) => o.status === "COMPLETED").length,
      },
      {
        status: "CANCELLED",
        label: "Đã hủy",
        count: orders.filter((o) => o.status === "CANCELLED").length,
      },
    ];

    return {
      revenueToday,
      revenueYesterday,
      ordersToday,
      ordersYesterday,
      revenueThisMonth,
      revenueLastMonth,
      totalStockUnits,
      lowStockCount,
      outOfStockCount,
      revenueByDay,
      topProducts,
      orderStatusCounts,
    };
  },
};

export function formatVnd(amount: number): string {
  return `₫${amount.toLocaleString("vi-VN")}`;
}

export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}