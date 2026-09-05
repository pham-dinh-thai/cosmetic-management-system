import { Card, Kpi, PageHeader } from "../../../components/ui/Primitives";

const REVENUE_7DAYS = [
  { day: "T2", value: 12 },
  { day: "T3", value: 18 },
  { day: "T4", value: 9 },
  { day: "T5", value: 22 },
  { day: "T6", value: 26 },
  { day: "T7", value: 31 },
  { day: "CN", value: 24 },
];

const TOP_PRODUCTS = [
  { code: "SC-01®", name: "Sữa rửa mặt vi sinh", sold: 248, revenue: "₫104.160.000" },
  { code: "AM-02™", name: "Tinh chất sáng da ban ngày", sold: 192, revenue: "₫130.560.000" },
  { code: "DM-02™", name: "Huyết thanh cân bằng", sold: 164, revenue: "₫96.760.000" },
  { code: "PM-02™", name: "Kem phục hồi ban đêm", sold: 121, revenue: "₫87.120.000" },
  { code: "SC-03®", name: "Toner dịu nhẹ", sold: 96, revenue: "₫38.400.000" },
];

const Overview: React.FC = () => {
  const max = Math.max(...REVENUE_7DAYS.map((d) => d.value));

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
          value="₫18.420.000"
          caption="+12.4% so với hôm qua"
          accent="forest"
        />
        <Kpi
          label="Đơn hàng hôm nay"
          value="62"
          caption="+5 đơn so với hôm qua"
          accent="lime"
        />
        <Kpi
          label="Doanh thu tháng này"
          value="₫428.6tr"
          caption="+18.2% so với tháng trước"
          accent="sage"
        />
        <Kpi
          label="Tồn kho"
          value="3.428"
          caption="12 sắp hết · 3 hết hàng"
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
                ₫142.8 triệu
              </h3>
              <p className="mt-1 text-[12px] text-[#666666]">
                Tổng doanh thu giai đoạn 31/08 — 06/09
              </p>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#666666]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1c3a13]" />
                Doanh thu
              </span>
            </div>
          </div>

          <div className="flex items-end gap-3 h-56">
            {REVENUE_7DAYS.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-3">
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t-md bg-[#1c3a13] transition-all"
                    style={{
                      height: `${(d.value / max) * 100}%`,
                      minHeight: "8px",
                    }}
                    title={`₫${d.value}tr`}
                  />
                </div>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#666666]">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
            Phân bổ kênh
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
            Doanh thu theo nguồn
          </h3>

          <div className="mt-6 flex flex-col gap-5">
            {[
              { label: "Trực tiếp", value: 58, color: "#1c3a13" },
              { label: "Online", value: 32, color: "#757c5d" },
              { label: "Đối tác", value: 10, color: "#9f995b" },
            ].map((c) => (
              <div key={c.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] text-[#1c3a13]">{c.label}</span>
                  <span className="text-[12px] font-medium text-[#666666]">
                    {c.value}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-[#eeeee9] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.value}%`, backgroundColor: c.color }}
                  />
                </div>
              </div>
            ))}
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

        <ol className="flex flex-col">
          {TOP_PRODUCTS.map((p, i) => (
            <li
              key={p.code}
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
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] text-[#1c3a13]">{p.revenue}</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#666666] mt-0.5">
                  {p.sold} sản phẩm
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
};

export default Overview;