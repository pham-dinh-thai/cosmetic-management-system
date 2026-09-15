import { Card, Kpi, PageHeader } from "../../../../components/ui/Primitives";
import { useOverview } from "./hook";
import { overviewApi } from "./api";

function formatDayKey(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

function formatCompact(amount: number): string {
  if (amount >= 1_000_000_000) return `₫${(amount / 1_000_000_000).toFixed(2)} tỷ`;
  if (amount >= 1_000_000) return `₫${(amount / 1_000_000).toFixed(1)}tr`;
  if (amount >= 1_000) return `₫${(amount / 1_000).toFixed(0)}k`;
  return overviewApi.formatVnd(amount);
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#757c5d",
  COMPLETED: "#1c3a13",
  CANCELLED: "#9f995b",
};

const Overview: React.FC = () => {
  const { data, loading, error } = useOverview();

  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        <PageHeader
          eyebrow="Trang chủ / Tổng quan"
          title="Tổng quan hoạt động"
          description="Theo dõi sức khỏe kinh doanh Guardian theo thời gian thực — doanh thu, đơn hàng và tồn kho trong cùng một góc nhìn."
        />
        <div className="py-12 text-center text-[#666666]">Đang tải dữ liệu…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-10">
        <PageHeader
          eyebrow="Trang chủ / Tổng quan"
          title="Tổng quan hoạt động"
          description="Theo dõi sức khỏe kinh doanh Guardian theo thời gian thực — doanh thu, đơn hàng và tồn kho trong cùng một góc nhìn."
        />
        <div className="bg-[#eeeee9] text-[#1c3a13] p-4 rounded-[16px] text-[14px]">
          {error || "Không có dữ liệu để hiển thị."}
        </div>
      </div>
    );
  }

  const revenueChange = overviewApi.percentChange(
    data.revenueToday,
    data.revenueYesterday,
  );
  const ordersDiff = data.ordersToday - data.ordersYesterday;
  const monthChange = overviewApi.percentChange(
    data.revenueThisMonth,
    data.revenueLastMonth,
  );

  const totalWeekRevenue = data.revenueByDay.reduce(
    (sum, d) => sum + d.value,
    0,
  );
  const maxDay = Math.max(...data.revenueByDay.map((d) => d.value));
  const period =
    data.revenueByDay.length > 1
      ? `${formatDayKey(data.revenueByDay[0].key)} — ${formatDayKey(data.revenueByDay[data.revenueByDay.length - 1].key)}`
      : "";

  const statusTotal = data.orderStatusCounts.reduce(
    (sum, s) => sum + s.count,
    0,
  );

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
          value={overviewApi.formatVnd(data.revenueToday)}
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
          label="Tồn kho"
          value={data.totalStockUnits.toLocaleString("vi-VN")}
          caption={`${data.lowStockCount} sắp hết · ${data.outOfStockCount} hết hàng`}
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
                style={{
                  fontWeight: 350,
                  fontSize: "28px",
                  lineHeight: 1.1,
                  letterSpacing: "-0.48px",
                }}
              >
                {formatCompact(totalWeekRevenue)}
              </h3>
              <p className="mt-1 text-[12px] text-[#666666]">
                Tổng doanh thu giai đoạn {period}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#666666]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1c3a13]" />
                Doanh thu
              </span>
            </div>
          </div>

          <div className="mt-auto w-full pt-8">
            <div className="relative w-full h-[280px] mb-4">
              {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
                <div 
                  key={tick} 
                  className="absolute left-0 right-0 flex items-center text-[10px] text-[#888] pointer-events-none"
                  style={{ 
                    bottom: `${tick * 100}%`, 
                    transform: 'translateY(50%)' 
                  }}
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
                      title={overviewApi.formatVnd(d.value)}
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
            style={{
              fontWeight: 350,
              fontSize: "24px",
              lineHeight: 1.1,
              letterSpacing: "-0.48px",
            }}
          >
            Trạng thái đơn hàng
          </h3>

          <div className="mt-6 flex flex-col gap-5">
            {data.orderStatusCounts.map((s) => {
              const pct =
                statusTotal === 0 ? 0 : Math.round((s.count / statusTotal) * 100);
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
                      style={{
                        width: `${pct}%`,
                        backgroundColor: STATUS_COLORS[s.status] ?? "#1c3a13",
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
              Top 5
            </h3>
          </div>
        </div>

        {data.topProducts.length === 0 ? (
          <p className="py-4 text-[14px] text-[#666666]">
            Chưa có dữ liệu sản phẩm bán chạy.
          </p>
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
                    {p.code}
                    {p.variantName ? ` · ${p.variantName}` : ""}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[14px] text-[#1c3a13]">
                    {overviewApi.formatVnd(p.revenue)}
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