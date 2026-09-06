import React from "react";
import { PageHeader, Card, Kpi } from "../../../../components/ui/Primitives";
import { useReports } from "./hook";

const ReportsPage: React.FC = () => {
  const { data, loading } = useReports();

  if (loading || !data) {
    return <div className="py-12 text-center text-[#666666]">Đang tải báo cáo…</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Báo cáo / Thống kê"
        title="Báo cáo kinh doanh"
        description="Thống kê hiệu quả bán hàng và phân tích doanh thu chi tiết."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Kpi label="Tổng doanh thu" value={`${data.totalRevenue.toLocaleString("vi-VN")}₫`} accent="forest" />
        <Kpi label="Tổng đơn hàng" value={String(data.totalOrders)} accent="lime" />
        <Kpi label="Giá trị đơn trung bình" value={`${data.avgOrderValue.toLocaleString("vi-VN")}₫`} accent="sage" />
        <Kpi label="Danh mục bán chạy nhất" value={data.topCategory} accent="olive" />
      </div>
      <Card className="p-8">
        <h3 className="text-[20px] text-[#1c3a13] font-medium mb-4">Biểu đồ tăng trưởng</h3>
        <p className="text-[14px] text-[#666666]">
          Dữ liệu thống kê được cập nhật tự động theo thời gian thực từ hoạt động bán hàng tại cửa hàng và trực tuyến.
        </p>
      </Card>
    </div>
  );
};

export default ReportsPage;
