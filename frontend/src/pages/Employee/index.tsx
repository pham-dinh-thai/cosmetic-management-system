import { useState } from "react";
import DashboardLayout, {
  type SidebarSection,
} from "../../components/DashboardLayout";

const SECTIONS = (active: string): SidebarSection[] => [
  {
    id: "today",
    title: "Hôm nay",
    items: [
      { id: "dashboard", label: "Lịch làm việc", active: active === "dashboard" },
      { id: "tasks", label: "Nhiệm vụ", badge: 8, active: active === "tasks" },
      { id: "notifications", label: "Thông báo", badge: 2, active: active === "notifications" },
    ],
  },
  {
    id: "sales",
    title: "Bán hàng",
    items: [
      { id: "orders", label: "Đơn hàng", active: active === "orders" },
      { id: "customers", label: "Khách hàng", active: active === "customers" },
      { id: "invoices", label: "Hóa đơn", active: active === "invoices" },
    ],
  },
  {
    id: "catalog",
    title: "Sản phẩm",
    items: [
      { id: "cosmetics", label: "Mỹ phẩm", active: active === "cosmetics" },
      { id: "inventory", label: "Tồn kho", active: active === "inventory" },
    ],
  },
  {
    id: "support",
    title: "Hỗ trợ",
    items: [
      { id: "help", label: "Trợ giúp", active: active === "help" },
      { id: "profile", label: "Hồ sơ cá nhân", active: active === "profile" },
    ],
  },
];

const Employee: React.FC = () => {
  const [active, setActive] = useState("dashboard");

  const sections = SECTIONS(active).map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      onClick: () => setActive(item.id),
    })),
  }));

  return (
    <DashboardLayout roleTitle="Employee" sidebarSections={sections} sidebarTitle="Nhân viên">
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#666666]">
            {`Nhân viên / ${active}`}
          </p>
          <h1
            className="mt-3 leading-[1.1]"
            style={{
              fontWeight: 350,
              fontSize: "clamp(32px, 4vw, 48px)",
              letterSpacing: "-0.02em",
            }}
          >
            Chào buổi sáng.
          </h1>
          <p className="mt-4 max-w-xl text-[16px] leading-[1.6] text-[#666666]">
            Hôm nay bạn có 8 nhiệm vụ và 2 thông báo mới. Sử dụng thanh bên bên
            phải để chuyển nhanh giữa các khu vực làm việc.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Đơn chờ xử lý", value: "06", caption: "Cập nhật 5 phút trước" },
            { label: "Khách hàng mới", value: "14", caption: "Hôm nay" },
            { label: "Tồn kho cần bổ sung", value: "03", caption: "Dưới ngưỡng an toàn" },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-[16px] bg-[#eeeee9] p-6 flex flex-col gap-3"
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
                {card.label}
              </p>
              <p
                className="text-[#1c3a13]"
                style={{
                  fontWeight: 350,
                  fontSize: "40px",
                  lineHeight: 1.1,
                  letterSpacing: "-0.4px",
                }}
              >
                {card.value}
              </p>
              <p className="text-[12px] text-[#666666]">{card.caption}</p>
            </div>
          ))}
        </div>

        <div className="rounded-[16px] border border-[#eeeee9] p-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#666666]">
            Mẹo
          </p>
          <p className="mt-3 text-[15px] leading-[1.6] text-[#1c3a13]">
            Thu gọn thanh bên phải bất kỳ lúc nào bằng nút mũi tên ở góc trên —
            chỉ còn biểu tượng nhỏ, phù hợp khi cần tập trung vào nội dung chính.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Employee;