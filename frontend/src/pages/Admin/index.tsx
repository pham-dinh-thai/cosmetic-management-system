import { useState } from "react";
import DashboardLayout, {
  type SidebarSection,
} from "../../components/DashboardLayout";
import Overview from "./pages/Overview";
import Customers from "./pages/Customers";
import Employees from "./pages/Employees";
import Suppliers from "./pages/Suppliers";
import Products from "./pages/Products";
import PurchaseOrders from "./pages/PurchaseOrders";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";

export type AdminPageKey =
  | "overview"
  | "customers"
  | "employees"
  | "suppliers"
  | "products"
  | "purchase"
  | "inventory"
  | "reports";

const SECTIONS = (active: AdminPageKey): SidebarSection[] => [
  {
    id: "general",
    title: "Tổng quan",
    items: [
      {
        id: "overview",
        label: "Tổng quan",
        active: active === "overview",
      },
      {
        id: "reports",
        label: "Báo cáo",
        active: active === "reports",
      },
    ],
  },
  {
    id: "people",
    title: "Đối tượng",
    items: [
      { id: "customers", label: "Khách hàng", active: active === "customers" },
      { id: "employees", label: "Nhân viên", active: active === "employees" },
      { id: "suppliers", label: "Nhà cung cấp", active: active === "suppliers" },
    ],
  },
  {
    id: "catalog",
    title: "Sản phẩm & Kho",
    items: [
      { id: "products", label: "Sản phẩm", active: active === "products" },
      { id: "purchase", label: "Nhập hàng", active: active === "purchase" },
      { id: "inventory", label: "Kho", active: active === "inventory" },
    ],
  },
];

const PAGE_TITLES: Record<AdminPageKey, string> = {
  overview: "Tổng quan",
  customers: "Khách hàng",
  employees: "Nhân viên",
  suppliers: "Nhà cung cấp",
  products: "Sản phẩm",
  purchase: "Nhập hàng",
  inventory: "Kho",
  reports: "Báo cáo",
};

const Admin: React.FC = () => {
  const [active, setActive] = useState<AdminPageKey>("overview");

  const sections = SECTIONS(active).map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      onClick: () => setActive(item.id as AdminPageKey),
    })),
  }));

  return (
    <DashboardLayout
      roleTitle="Admin"
      sidebarSections={sections}
      sidebarTitle={PAGE_TITLES[active]}
    >
      {active === "overview" && <Overview />}
      {active === "customers" && <Customers />}
      {active === "employees" && <Employees />}
      {active === "suppliers" && <Suppliers />}
      {active === "products" && <Products />}
      {active === "purchase" && <PurchaseOrders />}
      {active === "inventory" && <Inventory />}
      {active === "reports" && <Reports />}
    </DashboardLayout>
  );
};

export default Admin;