import { useEffect, useState } from "react";
import { Card, Kpi, PageHeader } from "../../../components/ui/Primitives";
import {
  overviewService,
  formatVnd,
  percentChange,
  type OverviewData,
} from "../../../services/overview.service";

function pctCaption(current: number, previous: number): string {
  const pct = percentChange(current, previous);
  if (pct === null) return "Chưa có dữ liệu so sánh";
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}% so với hôm qua`;
}

function periodLabel(from: Date, to: Date): string {
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
  return `${fmt(from)} — ${fmt(to)}`;
}

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  PENDING: { color: "#9f995b", bg: "#f3f0d9" },
  COMPLETED: { color: "#1c3a13", bg: "#e3ecd9" },
  CANCELLED: { color: "#b04747", bg: "#f6e3e3" },
};

const Overview: React.FC = () => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    overviewService
      .fetchOverview()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setError("Không thể tải dữ liệu tổng quan.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        <PageHeader
          eyebrow="Trang chủ / Tổng quan"
          title="Tổng quan hoạt động"
          description="Theo dõi sức khỏe kinh doanh Guardian theo thời gian thực — doanh thu, đơn hàng và tồn kho trong cùng một góc nhìn."
        />
        <div className="flex flex-col gap-10 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="rounded-[16px] border border-[#eeeee9] bg-[#fcfcf7] p-6 h-[136px]" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-[16px] border border-[#eeeee9] bg-[#fcfcf7] p-6 h-[380px]" />
            <div className="rounded-[16px] border border-[#eeeee9] bg-[#fcfcf7] p-6 h-[380px]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-10">
        <PageHeader
          eyebrow="Trang chủ / Tổng quan"
          title="Tổng quan hoạt động"
        />
        <Card className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="text-[15px] text-[#666666]">
            {error ?? "Chưa có dữ liệu."}
          </p>
        </Card>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.revenueByDay.map((d) => d.value), 0);
  const total7Days = data.revenueByDay.reduce((sum, d) => sum + d.value, 0);
  const monthCaption = (() => {
    const pct = percentChange(
      data.revenueThisMonth,
      data.revenueLastMonth,
    );
    if (pct === null) return "Chưa có dữ liệu so sánh";
    const sign = pct >= 0 ? "+" : "";
    return `${sign}${pct.toFixed(1)}% so với tháng trước`;
  })();

  const totalOrders = data.orderStatusCounts.reduce(
    (sum, s) => sum + s.count,
    0,
  );
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 6);

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="Trang chủ / Tổng quan"
        title="Tổng quan hoạt động"
        description="Theo dõi sức khỏe kinh doanh Guardian theo thời gian thực — doanh thu, đơn hàng và tồn kho trong cùng một góc nhìn."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Kpi
          label="Doanh thu hôm nay"
          value={formatVnd(data.revenueToday)}
          caption={pctCaption(data.revenueToday, data.revenueYesterday)}
          accent="forest"
        />
        <Kpi
          label="Đơn hàng hôm nay"
          value={String(data.ordersToday)}
          caption={pctCaption(data.ordersToday, data.ordersYesterday)}
          accent="lime"
        />
        <Kpi
          label="Doanh thu tháng này"
          value={formatVnd(data.revenueThisMonth)}
          caption={monthCaption}
          accent="sage"
        />
        <Kpi
          label="Tồn kho"
          value={data.totalStockUnits.toLocaleString("vi-VN")}
          caption={`${data.lowStockCount} sắp hết · ${data.outOfStockCount} hết hàng`}
          accent="olive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
                Doanh thu 7 ngày gần nhất
              </p>
              <h3
                className="mt-2 text-[#1c3a13]"
                style={{
                  fontWeight: 350,
                  fontSize: "28px",
                  lineHeight: 1.1,
                  letterSpacing: "-0.48px",
                }}
              >
                {formatVnd(total7Days)}
              </h3>
              <p className="mt-1 text-[12px] text-[#666666]">
                Tổng doanh thu giai đoạn {periodLabel(fromDate, new Date())}
              </p>
            </div>
          </div>

          <div className="flex items-end gap-3 h-56">
            {data.revenueByDay.map((d) => (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full flex-1 flex items-end">
                  {maxRevenue > 0 ? (
                    <div
                      className="w-full rounded-t-md bg-[#1c3a13] transition-all"
                      style={{
                        height: `${Math.max((d.value / maxRevenue) * 100, 2)}%`,
                      }}
                      title={formatVnd(d.value)}
                    />
                  ) : (
                    <div
                      className="w-full rounded-t-md bg-[#eeeee9]"
                      style={{ height: "8px" }}
                    />
                  )}
                </div>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#666666]">
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
            Tình trạng đơn
          </p>
          <h3
            className="mt-2 text-[#1c3a13]"
            style={{
              fontWeight: 350,
              fontSize: "24px",
              lineHeight: 1.1,
              letterSpacing: "-0.48px",
            }}
          >
            Đơn hàng theo trạng thái
          </h3>

          <div className="mt-6 flex flex-col gap-5">
            {data.orderStatusCounts.map((s) => {
              const pct = totalOrders > 0 ? (s.count / totalOrders) * 100 : 0;
              const colors = STATUS_COLORS[s.status] ?? {
                color: "#666666",
                bg: "#eeeee9",
              };
              return (
                <div key={s.status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[13px] text-[#1c3a13]">{s.label}</span>
                    <span className="text-[12px] font-medium text-[#666666]">
                      {s.count} · {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#eeeee9] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: colors.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
              Sản phẩm bán chạy
            </p>
            <h3
              className="mt-2 text-[#1c3a13]"
              style={{
                fontWeight: 350,
                fontSize: "24px",
                lineHeight: 1.1,
                letterSpacing: "-0.48px",
              }}
            >
              Top 5 trong tháng
            </h3>
          </div>
        </div>

        {data.topProducts.length === 0 ? (
          <div className="py-12 text-center text-[14px] text-[#666666]">
            Chưa có giao dịch bán hàng nào. Doanh thu sẽ được tổng hợp từ các
            đơn hàng đã hoàn thành.
          </div>
        ) : (
          <ol className="flex flex-col">
            {data.topProducts.map((p, i) => (
              <li
                key={`${p.code}-${i}`}
                className="flex items-center gap-5 py-4 border-t border-[#eeeee9] first:border-t-0"
              >
                <span
                  className="shrink-0 w-9 h-9 rounded-full bg-[#eeeee9] flex items-center justify-center text-[12px] font-medium text-[#1c3a13]"
                  style={{ fontWeight: 400 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[#1c3a13] truncate"
                    style={{ fontWeight: 350, fontSize: "16px" }}
                  >
                    {p.name}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#666666] mt-0.5">
                    {p.variantName ? `${p.variantName} · ` : ""}
                    {p.code}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[14px] text-[#1c3a13]">
                    {formatVnd(p.revenue)}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#666666] mt-0.5">
                    {p.sold} sản phẩm
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
};

export default Overview;