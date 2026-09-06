import { Card, PageHeader, Select } from "../../../components/ui/Primitives";

const Reports: React.FC = () => (
  <div className="flex flex-col gap-8">
    <PageHeader
      eyebrow="Quản lý / Báo cáo"
      title="Báo cáo"
      description="Tổng hợp và xuất báo cáo kinh doanh, vận hành và tồn kho."
    />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Select
        options={[
          { value: "7", label: "7 ngày gần nhất" },
          { value: "30", label: "30 ngày gần nhất" },
          { value: "90", label: "Quý này" },
          { value: "365", label: "12 tháng qua" },
        ]}
      />
      <Select
        options={[
          { value: "revenue", label: "Báo cáo doanh thu" },
          { value: "inventory", label: "Báo cáo tồn kho" },
          { value: "customer", label: "Báo cáo khách hàng" },
        ]}
      />
      <Select
        options={[
          { value: "csv", label: "Xuất CSV" },
          { value: "pdf", label: "Xuất PDF" },
        ]}
      />
    </div>

    <Card>
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
        Sắp có
      </p>
      <h3
        className="mt-2 text-[#1c3a13]"
        style={{ fontWeight: 350, fontSize: "24px", letterSpacing: "-0.48px" }}
      >
        Báo cáo chi tiết đang được phát triển
      </h3>
      <p className="mt-3 text-[14px] leading-[1.6] text-[#666666] max-w-xl">
        Chọn khung thời gian và loại báo cáo phía trên. Biểu đồ và bảng dữ liệu
        sẽ được kết nối với backend trong phiên tiếp theo.
      </p>
    </Card>
  </div>
);

export default Reports;