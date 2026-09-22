import React, { useState, useEffect } from "react";
import { Card, Kpi, PageHeader, Button } from "../../../../components/ui/Primitives";
import { useReports } from "./hook";
import type { ReportType, RevenueChartMode, TimeRangeOption } from "./type";

const TIME_OPTIONS: { value: TimeRangeOption; label: string }[] = [
  { value: "7", label: "7 ngày gần nhất" },
  { value: "30", label: "30 ngày gần nhất" },
  { value: "90", label: "Quý này (90 ngày)" },
  { value: "365", label: "12 tháng qua" },
  { value: "all", label: "Toàn bộ thời gian" },
];

const REPORT_TYPE_OPTIONS: { value: ReportType; label: string }[] = [
  { value: "revenue", label: "Báo cáo doanh thu & bán hàng" },
  { value: "inventory", label: "Báo cáo tồn kho & định giá" },
  { value: "customer", label: "Báo cáo khách hàng & doanh số" },
];

const CHART_MODE_OPTIONS: { value: RevenueChartMode; label: string }[] = [
  { value: "7d", label: "7 ngày gần nhất" },
  { value: "month", label: "Tháng" },
  { value: "quarter", label: "Quý" },
  { value: "year", label: "Năm" },
];

function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

function formatCompact(amount: number): string {
  if (amount >= 1_000_000_000) return `₫${(amount / 1_000_000_000).toFixed(2)} tỷ`;
  if (amount >= 1_000_000) return `₫${(amount / 1_000_000).toFixed(1)}tr`;
  if (amount >= 1_000) return `₫${(amount / 1_000).toFixed(0)}k`;
  return formatVnd(amount);
}

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  itemLabel = "mục",
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalItems === 0) return null;

  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-[#eeeee9]">
      <div className="flex items-center gap-3 text-[13px] text-[#666666] flex-wrap">
        <span>
          Hiển thị <strong className="text-[#1c3a13] font-medium">{startIdx + 1}</strong> -{" "}
          <strong className="text-[#1c3a13] font-medium">{endIdx}</strong> trong tổng số{" "}
          <strong className="text-[#1c3a13] font-medium">{totalItems}</strong> {itemLabel}
        </span>

        <span className="text-[#c4c7c4]">|</span>

        <div className="flex items-center gap-2">
          <span>Số dòng:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="h-[36px] rounded-lg border border-[#c4c7c4] bg-[#fcfcf7] px-3 text-[13px] text-[#1c3a13] focus:border-[#1c3a13] focus:outline-none transition-colors cursor-pointer"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className="h-[36px] px-3.5 text-[13px]"
        >
          Trước
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => {
            if (totalPages <= 7) return true;
            return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
          })
          .map((p, idx, arr) => {
            const prev = arr[idx - 1];
            const showEllipsis = prev && p - prev > 1;
            return (
              <React.Fragment key={p}>
                {showEllipsis && (
                  <span className="w-[24px] text-center text-[#666666] text-[13px]">...</span>
                )}
                <button
                  type="button"
                  onClick={() => onPageChange(p)}
                  className={`min-w-[36px] h-[36px] px-3 inline-flex items-center justify-center shrink-0 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                    currentPage === p
                      ? "bg-[#1c3a13] text-[#fcfcf7] border border-[#1c3a13]"
                      : "text-[#1c3a13] hover:bg-[#eeeee9] border border-[#eeeee9]"
                  }`}
                >
                  {p}
                </button>
              </React.Fragment>
            );
          })}

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className="h-[36px] px-3.5 text-[13px]"
        >
          Tiếp
        </Button>
      </div>
    </div>
  );
};

const ReportsPage: React.FC = () => {
  const {
    timeRange,
    setTimeRange,
    reportType,
    setReportType,
    data,
    loading,
    error,
    exporting,
    refetch,
    exportCsv,
  } = useReports();

  const [chartMode, setChartMode] = useState<RevenueChartMode>("7d");

  // Pagination states
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPageSize, setOrdersPageSize] = useState(10);

  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventoryPageSize, setInventoryPageSize] = useState(10);

  const [customerPage, setCustomerPage] = useState(1);
  const [customerPageSize, setCustomerPageSize] = useState(10);

  // Reset page when timeRange or reportType changes
  useEffect(() => {
    setOrdersPage(1);
    setInventoryPage(1);
    setCustomerPage(1);
  }, [timeRange, reportType]);

  if (loading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          eyebrow="Quản lý / Báo cáo"
          title="Báo cáo"
          description="Tổng hợp và xuất báo cáo kinh doanh, vận hành và tồn kho."
        />
        <div className="py-20 text-center text-[#666666]">
          <div className="inline-block h-[32px] w-[32px] animate-spin rounded-full border-2 border-solid border-[#1c3a13] border-r-transparent align-[-0.125em]" />
          <p className="mt-4 text-[14px]">Đang trích xuất dữ liệu báo cáo...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          eyebrow="Quản lý / Báo cáo"
          title="Báo cáo"
          description="Tổng hợp và xuất báo cáo kinh doanh, vận hành và tồn kho."
        />
        <div className="rounded-[16px] bg-[#eeeee9] p-6 text-[#1c3a13]">
          <p className="font-medium text-[15px]">{error || "Không có dữ liệu báo cáo."}</p>
          <Button variant="primary" size="sm" className="mt-4" onClick={refetch}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  // Active revenue timeline data based on selected chartMode
  const activeTimeline = data.revenue.timelines[chartMode] || [];
  const maxTimelineRevenue = Math.max(0, ...activeTimeline.map((t) => t.revenue));
  const totalModeRevenue = activeTimeline.reduce((sum, t) => sum + t.revenue, 0);

  // Donut chart constants
  const donut = data.revenue.donut;
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const completedDash = (donut.completedPercent / 100) * circumference;
  const cancelledDash = (donut.cancelledPercent / 100) * circumference;
  const otherDash = (donut.otherPercent / 100) * circumference;

  // Pagination for Orders Table
  const totalOrdersCount = data.revenue.orders.length;
  const totalOrdersPages = Math.ceil(totalOrdersCount / ordersPageSize) || 1;
  const currentOrdersPage = Math.min(ordersPage, totalOrdersPages);
  const startOrderIdx = (currentOrdersPage - 1) * ordersPageSize;
  const pagedOrders = data.revenue.orders.slice(startOrderIdx, startOrderIdx + ordersPageSize);

  // Pagination for Inventory Table
  const totalInventoryCount = data.inventory.items.length;
  const totalInventoryPages = Math.ceil(totalInventoryCount / inventoryPageSize) || 1;
  const currentInventoryPage = Math.min(inventoryPage, totalInventoryPages);
  const startInventoryIdx = (currentInventoryPage - 1) * inventoryPageSize;
  const pagedInventory = data.inventory.items.slice(startInventoryIdx, startInventoryIdx + inventoryPageSize);

  // Pagination for Customer Table
  const totalCustomersCount = data.customer.customers.length;
  const totalCustomersPages = Math.ceil(totalCustomersCount / customerPageSize) || 1;
  const currentCustomerPage = Math.min(customerPage, totalCustomersPages);
  const startCustomerIdx = (currentCustomerPage - 1) * customerPageSize;
  const pagedCustomers = data.customer.customers.slice(startCustomerIdx, startCustomerIdx + customerPageSize);

  return (
    <div className="flex flex-col gap-8">
      {/* Page Header */}
      <PageHeader
        eyebrow="Quản lý / Báo cáo"
        title="Báo cáo"
        description="Tổng hợp và xuất báo cáo kinh doanh, vận hành và tồn kho."
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={exportCsv}
              disabled={exporting}
              title="Xuất tệp CSV báo cáo"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>{exporting ? "Đang xuất..." : "Xuất CSV"}</span>
            </Button>

            <Button variant="ghost" size="sm" onClick={refetch} title="Làm mới số liệu">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Làm mới</span>
            </Button>
          </div>
        }
      />

      {/* 2 Dropdown Controls: Khung thời gian & Loại báo cáo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#666666] mb-1.5">
            Khung thời gian
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRangeOption)}
            className="w-full rounded-lg border border-[#c4c7c4] bg-[#fcfcf7] px-4 py-2.5 text-[14px] text-[#1c3a13] focus:border-[#1c3a13] focus:outline-none transition-colors"
          >
            {TIME_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-[#666666] mb-1.5">
            Loại báo cáo
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="w-full rounded-lg border border-[#c4c7c4] bg-[#fcfcf7] px-4 py-2.5 text-[14px] text-[#1c3a13] focus:border-[#1c3a13] focus:outline-none transition-colors"
          >
            {REPORT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================
          1. REVENUE REPORT VIEW
         ======================================================== */}
      {reportType === "revenue" && (
        <div className="flex flex-col gap-8">
          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Kpi
              label="Tổng doanh thu"
              value={formatCompact(data.revenue.summary.totalRevenue)}
              caption={`${data.revenue.summary.completedOrders} đơn hoàn thành / thanh toán`}
              accent="forest"
            />
            <Kpi
              label="Lợi nhuận gộp ước tính"
              value={formatCompact(data.revenue.summary.estimatedProfit)}
              caption={`Biên LN gộp ~${data.revenue.summary.totalRevenue > 0 ? ((data.revenue.summary.estimatedProfit / data.revenue.summary.totalRevenue) * 100).toFixed(1) : 0}%`}
              accent="lime"
            />
            <Kpi
              label="Tổng đơn hàng"
              value={String(data.revenue.summary.totalOrders)}
              caption={`Tỉ lệ hoàn thành: ${data.revenue.summary.completionRate.toFixed(1)}% (${data.revenue.summary.cancelledOrders} đã hủy)`}
              accent="sage"
            />
            <Kpi
              label="Giá trị trung bình đơn"
              value={formatCompact(data.revenue.summary.avgOrderValue)}
              caption={`${data.revenue.summary.totalProductsSold.toLocaleString("vi-VN")} sản phẩm tiêu thụ`}
              accent="olive"
            />
          </div>

          {/* ========================================================
              2 CHARTS RIGHT BELOW THE CARDS:
              1. Revenue Bar Chart (7d / Month / Quarter / Year)
              2. Circular Donut Chart (Completed vs Cancelled Orders)
             ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Revenue Timeline (2 cols) */}
            <Card className="lg:col-span-2 flex flex-col">
              <div className="flex items-start sm:items-end justify-between flex-wrap gap-4 mb-6">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
                    Biểu đồ doanh thu
                  </p>
                  <h3
                    className="mt-1.5 text-[#1c3a13]"
                    style={{
                      fontWeight: 350,
                      fontSize: "26px",
                      lineHeight: 1.1,
                      letterSpacing: "-0.48px",
                    }}
                  >
                    {formatVnd(totalModeRevenue)}
                  </h3>
                  <p className="mt-1 text-[12px] text-[#666666]">
                    {chartMode === "7d" && "Diễn biến doanh thu 7 ngày gần nhất"}
                    {chartMode === "month" && `Doanh thu theo 12 tháng năm ${new Date().getFullYear()}`}
                    {chartMode === "quarter" && `Doanh thu theo 4 quý năm ${new Date().getFullYear()}`}
                    {chartMode === "year" && `Doanh thu 5 năm gần nhất (${new Date().getFullYear() - 4} — ${new Date().getFullYear()})`}
                  </p>
                </div>

                {/* Mode Selector Toggle: 7 ngày gần nhất / Tháng / Quý / Năm */}
                <div className="inline-flex rounded-full p-1 bg-[#eeeee9] border border-[#e2e2dc]">
                  {CHART_MODE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setChartMode(opt.value)}
                      className={`px-3 py-1 text-[12px] font-medium rounded-full transition-all cursor-pointer ${
                        chartMode === opt.value
                          ? "bg-[#1c3a13] text-[#fcfcf7] shadow-sm"
                          : "text-[#666666] hover:text-[#1c3a13]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Visual Bars */}
              <div className="mt-auto w-full pt-4">
                <div className="relative w-full h-[240px] mb-3">
                  {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
                    <div
                      key={tick}
                      className="absolute left-0 right-0 flex items-center text-[10px] text-[#888] pointer-events-none"
                      style={{
                        bottom: `${tick * 100}%`,
                        transform: "translateY(50%)",
                      }}
                    >
                      <span className="w-16 text-right pr-2 shrink-0 bg-[#fcfcf7] relative z-10 whitespace-nowrap font-mono">
                        {maxTimelineRevenue === 0 && tick > 0
                          ? ""
                          : formatCompact(maxTimelineRevenue * tick)}
                      </span>
                      <div className="w-full h-px border-t border-dashed border-[#dcdcd7] absolute top-1/2 left-0 -translate-y-1/2 z-0" />
                    </div>
                  ))}

                  <div className="absolute inset-0 left-16 flex items-stretch gap-1 sm:gap-2 z-10">
                    {activeTimeline.map((item) => {
                      const pct =
                        maxTimelineRevenue > 0
                          ? (item.revenue / maxTimelineRevenue) * 100
                          : 0;

                      return (
                        <div
                          key={item.key}
                          className="flex-1 relative group cursor-pointer flex flex-col justify-end"
                        >
                          {/* Tooltip on Hover */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-30 pointer-events-none whitespace-nowrap bg-[#1c3a13] text-[#fcfcf7] text-[11px] py-1.5 px-2.5 rounded-lg shadow-md">
                            <span className="font-medium">{item.label}</span>
                            <span className="font-mono text-[#d3fa99]">
                              {formatVnd(item.revenue)}
                            </span>
                            <span className="text-[#c4c7c4]">{item.ordersCount} đơn</span>
                          </div>

                          <div
                            className="w-full max-w-[42px] mx-auto rounded-t-[4px] bg-[#1c3a13] transition-all group-hover:bg-[#757c5d]"
                            style={{
                              height: pct === 0 ? "0px" : `${pct}%`,
                              minHeight: item.revenue > 0 ? "4px" : "0px",
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* X-axis date labels */}
                <div className="flex items-center gap-1 sm:gap-2 pl-16 text-[#666666]">
                  {activeTimeline.map((item) => (
                    <div key={item.key} className="flex-1 text-center overflow-hidden">
                      <span className="text-[10px] font-medium tracking-[0.04em] block truncate">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Chart 2: Circular Donut Chart (Completed vs Cancelled Orders) */}
            <Card className="flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
                  Tỉ lệ trạng thái đơn
                </p>
                <h3
                  className="mt-1.5 text-[#1c3a13]"
                  style={{
                    fontWeight: 350,
                    fontSize: "22px",
                    lineHeight: 1.1,
                    letterSpacing: "-0.48px",
                  }}
                >
                  Đơn hoàn thành / Bị huỷ
                </h3>
                <p className="mt-1 text-[12px] text-[#666666]">
                  Tổng cộng {donut.totalCount} đơn phát sinh trong kỳ
                </p>
              </div>

              {/* Donut Chart SVG */}
              <div className="relative my-4 flex items-center justify-center">
                <svg width="180" height="180" viewBox="0 0 200 200" className="transform -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke="#eeeee9"
                    strokeWidth="24"
                  />

                  {/* Completed Arc (Green) */}
                  {donut.completedPercent > 0 && (
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke="#1c3a13"
                      strokeWidth="24"
                      strokeDasharray={`${completedDash} ${circumference}`}
                      strokeDashoffset="0"
                      strokeLinecap="butt"
                      className="transition-all duration-700 ease-out"
                    />
                  )}

                  {/* Cancelled Arc (Rust Red) */}
                  {donut.cancelledPercent > 0 && (
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke="#8f3f2a"
                      strokeWidth="24"
                      strokeDasharray={`${cancelledDash} ${circumference}`}
                      strokeDashoffset={String(-completedDash)}
                      strokeLinecap="butt"
                      className="transition-all duration-700 ease-out"
                    />
                  )}

                  {/* Other / Pending Arc (Neutral Olive/Grey) */}
                  {donut.otherPercent > 0 && (
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="none"
                      stroke="#c4c7c4"
                      strokeWidth="24"
                      strokeDasharray={`${otherDash} ${circumference}`}
                      strokeDashoffset={String(-(completedDash + cancelledDash))}
                      strokeLinecap="butt"
                      className="transition-all duration-700 ease-out"
                    />
                  )}
                </svg>

                {/* Center Content in Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span
                    className="font-mono text-[#1c3a13]"
                    style={{
                      fontSize: "24px",
                      fontWeight: 500,
                      lineHeight: 1,
                    }}
                  >
                    {donut.completedPercent.toFixed(0)}%
                  </span>
                  <span className="text-[11px] text-[#666666] mt-1 font-medium">
                    Hoàn thành
                  </span>
                </div>
              </div>

              {/* Detailed Legend */}
              <div className="flex flex-col gap-2.5 pt-2 border-t border-[#eeeee9]">
                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1c3a13]" />
                    <span className="text-[#1c3a13] font-medium">Đơn hoàn thành</span>
                  </div>
                  <span className="font-mono font-medium text-[#1c3a13]">
                    {donut.completedCount} đơn ({donut.completedPercent.toFixed(1)}%)
                  </span>
                </div>

                <div className="flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8f3f2a]" />
                    <span className="text-[#8f3f2a] font-medium">Đơn bị huỷ</span>
                  </div>
                  <span className="font-mono font-medium text-[#8f3f2a]">
                    {donut.cancelledCount} đơn ({donut.cancelledPercent.toFixed(1)}%)
                  </span>
                </div>

                {donut.otherCount > 0 && (
                  <div className="flex items-center justify-between text-[12px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#c4c7c4]" />
                      <span className="text-[#666666]">Đang xử lý / Khác</span>
                    </div>
                    <span className="font-mono text-[#666666]">
                      {donut.otherCount} đơn ({donut.otherPercent.toFixed(1)}%)
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Paginated Orders Table: "Dữ liệu phát sinh" */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
                  Dữ liệu phát sinh
                </p>
                <h3
                  className="mt-1 text-[#1c3a13]"
                  style={{
                    fontWeight: 350,
                    fontSize: "22px",
                    lineHeight: 1.1,
                    letterSpacing: "-0.48px",
                  }}
                >
                  Bảng chi tiết đơn hàng trong kỳ
                </h3>
              </div>
              <span className="text-[12px] text-[#666666]">
                Tổng cộng {totalOrdersCount} đơn hàng
              </span>
            </div>

            {totalOrdersCount === 0 ? (
              <p className="py-8 text-center text-[13px] text-[#666666]">
                Chưa có đơn hàng nào trong khoảng thời gian này.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-[#eeeee9] text-[11px] uppercase tracking-wider text-[#666666]">
                        <th className="py-3 px-3 font-medium">Mã đơn</th>
                        <th className="py-3 px-3 font-medium">Khách hàng</th>
                        <th className="py-3 px-3 font-medium">Thời gian</th>
                        <th className="py-3 px-3 font-medium">Thanh toán</th>
                        <th className="py-3 px-3 font-medium">Trạng thái</th>
                        <th className="py-3 px-3 text-right font-medium">Tổng tiền</th>
                        <th className="py-3 px-3 text-right font-medium">Lợi nhuận</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eeeee9]">
                      {pagedOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-[#f6f6f2] transition-colors">
                          <td className="py-3 px-3 font-mono font-medium text-[#1c3a13]">{o.code}</td>
                          <td className="py-3 px-3 text-[#1c3a13]">{o.customerName}</td>
                          <td className="py-3 px-3 text-[#666666] text-[12px]">
                            {new Date(o.createdAt).toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-3 px-3 text-[#666666] text-[12px]">
                            <span className="inline-block rounded px-2 py-0.5 bg-[#eeeee9]">
                              {o.paymentMethod === "CASH"
                                ? "Tiền mặt (COD)"
                                : o.paymentMethod === "BANK_TRANSFER"
                                  ? "Chuyển khoản"
                                  : o.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[12px]">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full font-medium text-[11px] ${
                                o.status === "DELIVERED"
                                  ? "bg-[#d3fa99]/40 text-[#1c3a13]"
                                  : o.status === "CANCELLED"
                                    ? "bg-[#ffdede] text-[#8f3f2a]"
                                    : "bg-[#eeeee9] text-[#757c5d]"
                              }`}
                            >
                              {o.status === "DELIVERED"
                                ? "Giao thành công"
                                : o.status === "CANCELLED"
                                  ? "Đã hủy"
                                  : o.status === "SHIPPING"
                                    ? "Đang giao"
                                    : "Đang xử lý"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-medium text-[#1c3a13]">
                            {formatVnd(o.totalAmount)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[#757c5d] font-medium">
                            {formatVnd(o.profit)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                <PaginationBar
                  currentPage={currentOrdersPage}
                  totalPages={totalOrdersPages}
                  pageSize={ordersPageSize}
                  totalItems={totalOrdersCount}
                  itemLabel="đơn hàng"
                  onPageChange={setOrdersPage}
                  onPageSizeChange={(newSize) => {
                    setOrdersPageSize(newSize);
                    setOrdersPage(1);
                  }}
                />
              </>
            )}
          </Card>

          {/* Top Products */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
                  Hiệu quả kinh doanh
                </p>
                <h3
                  className="mt-1 text-[#1c3a13]"
                  style={{
                    fontWeight: 350,
                    fontSize: "22px",
                    lineHeight: 1.1,
                    letterSpacing: "-0.48px",
                  }}
                >
                  Top 15 sản phẩm bán chạy nhất
                </h3>
              </div>
            </div>

            {data.revenue.topProducts.length === 0 ? (
              <p className="py-8 text-center text-[13px] text-[#666666]">
                Chưa có dữ liệu sản phẩm trong khoảng thời gian này.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#eeeee9] text-[11px] uppercase tracking-wider text-[#666666]">
                      <th className="py-3 px-2 font-medium">#</th>
                      <th className="py-3 px-3 font-medium">Mã SP</th>
                      <th className="py-3 px-3 font-medium">Tên sản phẩm</th>
                      <th className="py-3 px-3 font-medium">Ngành hàng</th>
                      <th className="py-3 px-3 text-right font-medium">Đã bán</th>
                      <th className="py-3 px-3 text-right font-medium">Doanh thu</th>
                      <th className="py-3 px-3 text-right font-medium">Lợi nhuận</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eeeee9]">
                    {data.revenue.topProducts.map((p, idx) => (
                      <tr key={`${p.code}-${idx}`} className="hover:bg-[#f6f6f2] transition-colors">
                        <td className="py-3 px-2 font-mono text-[11px] text-[#666666]">{idx + 1}</td>
                        <td className="py-3 px-3 font-mono font-medium text-[#1c3a13]">{p.code}</td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-[#1c3a13]">{p.name}</div>
                          <div className="text-[11px] text-[#666666]">{p.variantName}</div>
                        </td>
                        <td className="py-3 px-3 text-[#666666]">{p.categoryName}</td>
                        <td className="py-3 px-3 text-right font-mono font-medium text-[#1c3a13]">
                          {p.quantitySold.toLocaleString("vi-VN")}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[#1c3a13]">
                          {formatVnd(p.revenue)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[#757c5d] font-medium">
                          {formatVnd(p.profit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ========================================================
          2. INVENTORY REPORT VIEW
         ======================================================== */}
      {reportType === "inventory" && (
        <div className="flex flex-col gap-8">
          {/* KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Kpi
              label="Tổng mặt hàng tồn"
              value={`${data.inventory.summary.totalItems.toLocaleString("vi-VN")} SKU`}
              caption={`Tổng ${data.inventory.summary.totalUnits.toLocaleString("vi-VN")} đơn vị sản phẩm`}
              accent="forest"
            />
            <Kpi
              label="Tổng giá trị vốn tồn"
              value={formatCompact(data.inventory.summary.totalInventoryValue)}
              caption="Tính theo giá vốn nhập (costPrice)"
              accent="lime"
            />
            <Kpi
              label="Mặt hàng sắp hết"
              value={`${data.inventory.summary.lowStockCount} SKU`}
              caption="Dưới định mức tối thiểu (≤ 20 sản phẩm)"
              accent="sage"
            />
            <Kpi
              label="Mặt hàng đã hết"
              value={`${data.inventory.summary.outOfStockCount} SKU`}
              caption="Cần lên kế hoạch đặt hàng bổ sung"
              accent="olive"
            />
          </div>

          {/* Paginated Inventory Valuation Table */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
                  Kiểm kê & Định giá
                </p>
                <h3
                  className="mt-1 text-[#1c3a13]"
                  style={{
                    fontWeight: 350,
                    fontSize: "22px",
                    lineHeight: 1.1,
                    letterSpacing: "-0.48px",
                  }}
                >
                  Bảng chi tiết tồn kho & giá trị vốn hàng hóa
                </h3>
              </div>
              <span className="text-[12px] text-[#666666]">
                Tổng cộng {totalInventoryCount} mặt hàng
              </span>
            </div>

            {totalInventoryCount === 0 ? (
              <p className="py-8 text-center text-[13px] text-[#666666]">
                Chưa có dữ liệu tồn kho.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-[#eeeee9] text-[11px] uppercase tracking-wider text-[#666666]">
                        <th className="py-3 px-3 font-medium">Mã SP</th>
                        <th className="py-3 px-3 font-medium">Sản phẩm</th>
                        <th className="py-3 px-3 text-right font-medium">Giá vốn</th>
                        <th className="py-3 px-3 text-right font-medium">Giá bán</th>
                        <th className="py-3 px-3 text-right font-medium">Tồn kho</th>
                        <th className="py-3 px-3 text-right font-medium">Mức tối thiểu</th>
                        <th className="py-3 px-3 text-right font-medium">Tổng giá trị vốn</th>
                        <th className="py-3 px-3 font-medium">Tình trạng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eeeee9]">
                      {pagedInventory.map((item) => (
                        <tr key={item.id} className="hover:bg-[#f6f6f2] transition-colors">
                          <td className="py-3 px-3 font-mono font-medium text-[#1c3a13]">{item.code}</td>
                          <td className="py-3 px-3">
                            <div className="font-medium text-[#1c3a13]">{item.name}</div>
                            {item.variantName && (
                              <div className="text-[11px] text-[#666666]">{item.variantName}</div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[#666666]">
                            {formatVnd(item.costPrice)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[#1c3a13]">
                            {formatVnd(item.price)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-medium text-[#1c3a13]">
                            {item.quantity.toLocaleString("vi-VN")}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-[#666666]">
                            {item.minStock.toLocaleString("vi-VN")}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-medium text-[#1c3a13]">
                            {formatVnd(item.totalValue)}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full font-medium text-[11px] ${
                                item.status === "OUT_OF_STOCK"
                                  ? "bg-[#ffdede] text-[#8f3f2a]"
                                  : item.status === "LOW_STOCK"
                                    ? "bg-[#fff3cd] text-[#9f995b]"
                                    : "bg-[#d3fa99]/40 text-[#1c3a13]"
                              }`}
                            >
                              {item.status === "OUT_OF_STOCK"
                                ? "Hết hàng"
                                : item.status === "LOW_STOCK"
                                  ? "Sắp hết hàng"
                                  : "Đủ hàng"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <PaginationBar
                  currentPage={currentInventoryPage}
                  totalPages={totalInventoryPages}
                  pageSize={inventoryPageSize}
                  totalItems={totalInventoryCount}
                  itemLabel="mặt hàng"
                  onPageChange={setInventoryPage}
                  onPageSizeChange={(newSize) => {
                    setInventoryPageSize(newSize);
                    setInventoryPage(1);
                  }}
                />
              </>
            )}
          </Card>
        </div>
      )}

      {/* ========================================================
          3. CUSTOMER REPORT VIEW
         ======================================================== */}
      {reportType === "customer" && (
        <div className="flex flex-col gap-8">
          {/* KPI Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Kpi
              label="Tổng khách hàng"
              value={`${data.customer.summary.totalCustomers.toLocaleString("vi-VN")}`}
              caption={`${data.customer.summary.activeCustomers} tài khoản đang hoạt động`}
              accent="forest"
            />
            <Kpi
              label="Khách mua hàng"
              value={`${data.customer.summary.buyingCustomers} người`}
              caption={`Tỉ lệ chuyển đổi: ${data.customer.summary.totalCustomers > 0 ? ((data.customer.summary.buyingCustomers / data.customer.summary.totalCustomers) * 100).toFixed(1) : 0}%`}
              accent="lime"
            />
            <Kpi
              label="Chi tiêu TB / khách"
              value={formatCompact(data.customer.summary.avgSpendPerCustomer)}
              caption="Tính trên số khách đã phát sinh đơn"
              accent="sage"
            />
            <Kpi
              label="Khách hàng TOP 1"
              value={formatCompact(data.customer.summary.topSpenderAmount)}
              caption={data.customer.summary.topSpenderName}
              accent="olive"
            />
          </div>

          {/* Paginated Customer Ranking Table */}
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
                  Xếp hạng & Doanh số
                </p>
                <h3
                  className="mt-1 text-[#1c3a13]"
                  style={{
                    fontWeight: 350,
                    fontSize: "22px",
                    lineHeight: 1.1,
                    letterSpacing: "-0.48px",
                  }}
                >
                  Bảng đóng góp doanh số theo khách hàng
                </h3>
              </div>
              <span className="text-[12px] text-[#666666]">
                Tổng cộng {totalCustomersCount} khách hàng
              </span>
            </div>

            {totalCustomersCount === 0 ? (
              <p className="py-8 text-center text-[13px] text-[#666666]">
                Chưa có dữ liệu khách hàng.
              </p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-[#eeeee9] text-[11px] uppercase tracking-wider text-[#666666]">
                        <th className="py-3 px-2 font-medium">#</th>
                        <th className="py-3 px-3 font-medium">Mã KH</th>
                        <th className="py-3 px-3 font-medium">Khách hàng</th>
                        <th className="py-3 px-3 font-medium">Liên hệ</th>
                        <th className="py-3 px-3 text-right font-medium">Số đơn</th>
                        <th className="py-3 px-3 text-right font-medium">Tổng chi tiêu</th>
                        <th className="py-3 px-3 font-medium">Đơn gần nhất</th>
                        <th className="py-3 px-3 font-medium">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eeeee9]">
                      {pagedCustomers.map((c, idx) => (
                        <tr key={c.id} className="hover:bg-[#f6f6f2] transition-colors">
                          <td className="py-3 px-2 font-mono text-[11px] text-[#666666]">
                            {startCustomerIdx + idx + 1}
                          </td>
                          <td className="py-3 px-3 font-mono font-medium text-[#1c3a13]">{c.code}</td>
                          <td className="py-3 px-3 font-medium text-[#1c3a13]">{c.name}</td>
                          <td className="py-3 px-3 text-[12px] text-[#666666]">
                            <div>{c.email}</div>
                            <div>{c.phone}</div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-medium text-[#1c3a13]">
                            {c.ordersCount}
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-medium text-[#1c3a13]">
                            {formatVnd(c.totalSpend)}
                          </td>
                          <td className="py-3 px-3 text-[12px] text-[#666666]">
                            {c.lastOrderDate ? (
                              new Date(c.lastOrderDate).toLocaleDateString("vi-VN")
                            ) : (
                              <span className="text-[#999]">Chưa có</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full font-medium text-[11px] ${
                                c.isActive
                                ? "bg-[#d3fa99]/40 text-[#1c3a13]"
                                : "bg-[#eeeee9] text-[#888]"
                              }`}
                            >
                              {c.isActive ? "Hoạt động" : "Tạm khóa"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <PaginationBar
                  currentPage={currentCustomerPage}
                  totalPages={totalCustomersPages}
                  pageSize={customerPageSize}
                  totalItems={totalCustomersCount}
                  itemLabel="khách hàng"
                  onPageChange={setCustomerPage}
                  onPageSizeChange={(newSize) => {
                    setCustomerPageSize(newSize);
                    setCustomerPage(1);
                  }}
                />
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
