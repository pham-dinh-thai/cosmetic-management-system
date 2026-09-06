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
import AddProduct from "./pages/AddProduct";
import ProductDetailAdmin from "./pages/ProductDetailAdmin";
import EditProduct from "./pages/EditProduct";
import Categories from "./pages/Categories";

export type AdminPageKey =
  | "overview"
  | "customers"
  | "employees"
  | "suppliers"
  | "products"
  | "products-add"
  | "products-detail"
  | "products-edit"
  | "categories"
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
      { id: "categories", label: "Danh mục", active: active === "categories" },
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
  "products-add": "Thêm sản phẩm",
  "products-detail": "Chi tiết sản phẩm",
  "products-edit": "Sửa sản phẩm",
  categories: "Danh mục",
  purchase: "Nhập hàng",
  inventory: "Kho",
  reports: "Báo cáo",
};

const Admin: React.FC = () => {
  const [active, setActive] = useState<AdminPageKey>("overview");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const sections = SECTIONS(active).map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      onClick: () => setActive(item.id as AdminPageKey),
    })),
  }));

  const handleViewDetail = (id: string) => {
    setSelectedProductId(id);
    setActive("products-detail");
  };

  const handleEdit = (id: string) => {
    setSelectedProductId(id);
    setActive("products-edit");
  };

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
      {active === "products" && (
        <Products 
          onAdd={() => setActive("products-add")} 
          onViewDetail={handleViewDetail}
          onEdit={handleEdit}
        />
      )}
      {active === "products-add" && <AddProduct onBack={() => setActive("products")} />}
      {active === "products-detail" && selectedProductId && (
        <ProductDetailAdmin productId={selectedProductId} onBack={() => setActive("products")} />
      )}
      {active === "products-edit" && selectedProductId && (
        <EditProduct productId={selectedProductId} onBack={() => setActive("products")} />
      )}
      {active === "categories" && <Categories />}
      {active === "purchase" && <PurchaseOrders />}
      {active === "inventory" && <Inventory />}
      {active === "reports" && <Reports />}
    </DashboardLayout>
  );
};

export default Admin;