import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import DashboardLayout, {
  type SidebarSection,
} from "../../components/DashboardLayout";

import PosPage from "./routes/POS";

export type EmployeePageKey = "pos";

const getActiveKey = (pathname: string): EmployeePageKey => {
  if (pathname.includes("/employee/pos")) return "pos";
  return "pos";
};

const PAGE_TITLES: Record<EmployeePageKey, string> = {
  pos: "Bán hàng (POS)",
};

const SECTIONS = (active: EmployeePageKey): SidebarSection[] => [
  {
    id: "sales",
    title: "Bán hàng",
    items: [{ id: "pos", label: "Tạo hoá đơn", active: active === "pos" }],
  },
];

const Employee: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeKey = getActiveKey(location.pathname);

  const sections = SECTIONS(activeKey).map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      onClick: () => navigate(`/employee/${item.id}`),
    })),
  }));

  return (
    <DashboardLayout
      roleTitle="Employee"
      sidebarSections={sections}
      sidebarTitle={PAGE_TITLES[activeKey]}
    >
      <Routes>
        <Route path="pos" element={<PosPage />} />
        <Route path="*" element={<Navigate to="pos" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Employee;