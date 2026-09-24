import React, { useEffect, useState } from "react";
import { PageHeader, Card, Kpi } from "../../../../components/ui/Primitives";
import { ordersService, type OrderReadModel } from "../../../../services/orders.service";
import { formatVnd } from "../../../../services/overview.service";

const VN_DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const STATUS_LABEL: Record<string, string> = {
  PENDING_CONFIRMATION: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  PREPARING: "Đang chuẩn bị hàng",
  SHIPPING: "Đang giao",
  DELIVERED: "Giao thành công",
  CANCELLED: "Đã hủy",
  DELIVERY_FAILED: "Giao thất bại",
  RETURNED: "Đã hoàn hàng",
  REFUNDED: "Đã hoàn tiền",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING_CONFIRMATION: "#9f995b",
  CONFIRMED: "#757c5d",
  PREPARING: "#757c5d",
  SHIPPING: "#2a4a6b",
  DELIVERED: "#1c3a13",
  CANCELLED: "#8f3f2a",
  DELIVERY_FAILED: "#8f3f2a",
  RETURNED: "#9f995b",
  REFUNDED: "#666666",
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function daysAgo(days: number, base: Date = new Date()): Date {
  const d = new Date(base);
  d.setDate(d.getDate() - days);
  return d;
}

function formatCompact(amount: number): string {
  if (amount >= 1_000_000_000) return `₫${(amount / 1_000_000_000).toFixed(2)} tỷ`;
  if (amount >= 1_000_000) return `₫${(amount / 1_000_000).toFixed(1)}tr`;
  if (amount >= 1_000) return `₫${(amount / 1_000).toFixed(0)}k`;
  return formatVnd(amount);
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

function buildSalesData(orders: OrderReadModel[]) {
  const now = new Date();
  const todayStart = startOfDay(now);
  const yesterdayStart = startOfDay(daysAgo(1, now));

  const delivered = orders.filter((o) => o.status === "DELIVERED");
  const amountOf = (o: OrderReadModel) => Number(o.totalAmount ?? 0);

  const revenueToday = delivered
    .filter((o) => isSameDay(new Date(o.createdAt), now))
    .reduce((sum, o) => sum + amountOf(o), 0);

  const revenueYesterday = delivered
    .filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= yesterdayStart.getTime() && t < todayStart.getTime();
    })
    .reduce((sum, o) => sum + amountOf(o), 0);

  const ordersToday = orders.filter((o) => isSameDay(new Date(o.createdAt), now)).length;
  const ordersYesterday = orders
    .filter((o) => {
      const t = new Date(o.createdAt).getTime();
      return t >= yesterdayStart.getTime() && t < todayStart.getTime();
    })
    .length;

  const revenueThisMonth = delivered
    .filter((o) => isSameMonth(new Date(o.createdAt), now))
    .reduce((sum, o) => sum + amountOf(o), 0);

  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const revenueLastMonth = delivered
    .filter((o) => isSameMonth(new Date(o.createdAt), prevMonth))
    .reduce((sum, o) => sum + amountOf(o), 0);

  const revenueByDay: { key: string; label: string; value: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const day = daysAgo(i, now);
    revenueByDay.push({
      key: day.toISOString().slice(0, 10),
      label: VN_DAYS[day.getDay()],
      value: delivered
        .filter((o) => isSameDay(new Date(o.createdAt), day))
        .reduce((sum, o) => sum + amountOf(o), 0),
    });
  }

  const statusCounts = Object.keys(STATUS_LABEL).map((status) => ({
    status,
    label: STATUS_LABEL[status],
    count: orders.filter((o) => o.status === status).length,
  }));

  const recent = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 6);

  return {
    revenueToday,
    revenueYesterday,
    ordersToday,
    ordersYesterday,
    revenueThisMonth,
    revenueLastMonth,
    revenueByDay,
    statusCounts,
    recent,
  };
}

const SalesDashboard: React.FC = () => {
  const [data, setData] = useState<ReturnType<typeof buildSalesData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const orders = await ordersService.getOrders();
        if (!active) return;
        setData(buildSalesData(orders));
      } catch (err) {
        if (!active) return;
        setError("Không thể tải dữ liệu bán hàng. Vui lòng thử lại.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const header = (
    <PageHeader
      eyebrow="Bán hàng / Tổng quan"
      title="Tổng quan bán hàng"
      description="Doanh thu, đơn hàng và trạng thái đơn theo thời gian thực."
    />
  );

  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        {header}
        <div className="py-12 text-center text-[#666666]">Đang tải dữ liệu…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-10">
        {header}
        <div className="bg-[#eeeee9] text-[#1c3a13] p-4 rounded-[16px] text-[14px]">
          {error || "Không có dữ liệu để hiển thị."}
        </div>
      </div>
    );
  }

  const revenueChange = percentChange(data.revenueToday, data.revenueYesterday);
  const ordersDiff = data.ordersToday - data.ordersYesterday;
  const monthChange = percentChange(data.revenueThisMonth, data.revenueLastMonth);
  const totalWeekRevenue = data.revenueByDay.reduce((sum, d) => sum + d.value, 0);
  const maxDay = Math.max(...data.revenueByDay.map((d) => d.value));
  const statusTotal = data.statusCounts.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="flex flex-col gap-10">
      {header}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Kpi
          label="Doanh thu hôm nay"
          value={formatVnd(data.revenueToday)}
          caption={
            revenueChange !== null
              ? `+${revenueChange.toFixed(1)}% so với hôm qua`
              : "Chưa có số liệu hôm qua"
          }
          accent="forest"
        />
        <Kpi
          label="Đơn hàng hôm nay"
          value={String(data.ordersToday)}
          caption={`${ordersDiff >= 0 ? "+" : ""}${ordersDiff} đơn so với hôm qua`}
          accent="lime"
        />
        <Kpi
          label="Doanh thu tháng này"
          value={formatCompact(data.revenueThisMonth)}
          caption={
            monthChange !== null
              ? `+${monthChange.toFixed(1)}% so với tháng trước`
              : "Chưa có số liệu tháng trước"
          }
          accent="sage"
        />
        <Kpi
          label="Đơn chờ xác nhận"
          value={String(
            data.statusCounts.find((s) => s.status === "PENDING_CONFIRMATION")?.count ?? 0,
          )}
          caption="cần xử lý"
          accent="olive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
                Doanh thu 7 ngày gần nhất
              </p>
              <h3
                className="mt-2 text-[#1c3a13]"
                style={{ fontWeight: 350, fontSize: "28px", lineHeight: 1.1, letterSpacing: "-0.48px" }}
              >
                {formatCompact(totalWeekRevenue)}
              </h3>
            </div>
          </div>

          <div className="mt-auto w-full pt-8">
            <div className="relative w-full h-[240px] mb-4">
              {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
                <div
                  key={tick}
                  className="absolute left-0 right-0 flex items-center text-[10px] text-[#888] pointer-events-none"
                  style={{ bottom: `${tick * 100}%`, transform: "translateY(50%)" }}
                >
                  <span className="w-14 text-right pr-2 shrink-0 bg-[#fcfcf7] relative z-10 whitespace-nowrap">
                    {maxDay === 0 && tick > 0 ? "" : formatCompact(maxDay * tick)}
                  </span>
                  <div className="w-full h-px border-t border-dashed border-[#dcdcd7] absolute top-1/2 left-0 -translate-y-1/2 z-0" />
                </div>
              ))}

              <div className="absolute inset-0 left-14 flex items-stretch gap-3 z-10">
                {data.revenueByDay.map((d) => (
                  <div key={d.key} className="flex-1 relative group cursor-pointer">
                    <div
                      className="absolute bottom-0 w-full rounded-t-[4px] bg-[#1c3a13] transition-all group-hover:bg-[#757c5d]"
                      style={{
                        height: d.value === 0 || maxDay === 0 ? "0px" : `${(d.value / maxDay) * 100}%`,
                        minHeight: d.value === 0 || maxDay === 0 ? "0px" : "4px",
                      }}
                      title={formatVnd(d.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pl-14 text-[#666666]">
              {data.revenueByDay.map((d) => (
                <div key={d.key} className="flex-1 text-center">
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em]">
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
            Phân bố đơn hàng
          </p>
          <h3
            className="mt-2 text-[#1c3a13]"
            style={{ fontWeight: 350, fontSize: "24px", lineHeight: 1.1, letterSpacing: "-0.48px" }}
          >
            Trạng thái đơn hàng
          </h3>

          <div className="mt-6 flex flex-col gap-5">
            {data.statusCounts.map((s) => {
              const pct = statusTotal === 0 ? 0 : Math.round((s.count / statusTotal) * 100);
              return (
                <div key={s.status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] text-[#1c3a13]">{s.label}</span>
                    <span className="text-[12px] font-medium text-[#666666]">
                      {s.count} · {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#eeeee9] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: STATUS_COLORS[s.status] ?? "#1c3a13" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
            Đơn hàng
          </p>
          <h3
            className="mt-2 text-[#1c3a13]"
            style={{ fontWeight: 350, fontSize: "24px", lineHeight: 1.1, letterSpacing: "-0.48px" }}
          >
            Đơn hàng gần đây
          </h3>
        </div>

        {data.recent.length === 0 ? (
          <p className="py-4 text-[14px] text-[#666666]">Chưa có đơn hàng nào.</p>
        ) : (
          <div className="flex flex-col">
            {data.recent.map((o) => (
              <div
                key={o.id}
                className="flex items-center gap-5 py-4 border-t border-[#eeeee9] first:border-t-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-[#1c3a13] truncate" style={{ fontWeight: 350, fontSize: "16px" }}>
                    {o.code}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#666666] mt-0.5">
                    {o.customerName || "Khách lẻ"} · {fmtDate(o.createdAt)}
                  </p>
                </div>
                <span className="shrink-0 text-[12px] px-2.5 py-1 rounded-full bg-[#eeeee9] text-[#1c3a13]">
                  {STATUS_LABEL[o.status] ?? o.status}
                </span>
                <p className="text-right shrink-0 text-[14px] text-[#1c3a13]">
                  {formatVnd(Number(o.totalAmount ?? 0))}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default SalesDashboard;