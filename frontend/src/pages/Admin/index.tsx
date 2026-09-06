import React from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout, { type SidebarSection } from "../../components/DashboardLayout";

import OverviewPage from "./routes/Overview";
import ReportsPage from "./routes/Reports";
import CustomersPage from "./routes/Customers";
import EmployeesPage from "./routes/Employees";
import SuppliersPage from "./routes/Suppliers";
import ProductsPage from "./routes/Products";
import AddProductPage from "./routes/AddProduct";
import EditProductPage from "./routes/EditProduct";
import ProductDetailAdminPage from "./routes/ProductDetailAdmin";
import CategoriesPage from "./routes/Categories";
import PurchaseOrdersPage from "./routes/PurchaseOrders";
import InventoryPage from "./routes/Inventory";

export type AdminPageKey =
  | "overview"
  | "customers"
  | "employees"
  | "suppliers"
  | "products"
  | "categories"
  | "purchase"
  | "inventory"
  | "reports";

const getActiveKey = (pathname: string): AdminPageKey => {
  if (pathname.includes("/admin/reports")) return "reports";
  if (pathname.includes("/admin/customers")) return "customers";
  if (pathname.includes("/admin/employees")) return "employees";
  if (pathname.includes("/admin/suppliers")) return "suppliers";
  if (pathname.includes("/admin/products")) return "products";
  if (pathname.includes("/admin/categories")) return "categories";
  if (pathname.includes("/admin/purchase")) return "purchase";
  if (pathname.includes("/admin/inventory")) return "inventory";
  return "overview";
};

const PAGE_TITLES: Record<AdminPageKey, string> = {
  overview: "Tổng quan",
  customers: "Khách hàng",
  employees: "Nhân viên",
  suppliers: "Nhà cung cấp",
  products: "Sản phẩm",
  categories: "Danh mục",
  purchase: "Nhập hàng",
  inventory: "Kho",
  reports: "Báo cáo",
};

const SECTIONS = (active: AdminPageKey): SidebarSection[] => [
  {
    id: "general",
    title: "Tổng quan",
    items: [
      { id: "overview", label: "Tổng quan", active: active === "overview" },
      { id: "reports", label: "Báo cáo", active: active === "reports" },
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

const Admin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeKey = getActiveKey(location.pathname);

  const sections = SECTIONS(activeKey).map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      onClick: () => navigate(`/admin/${item.id}`),
    })),
  }));

  return (
    <DashboardLayout
      roleTitle="Admin"
      sidebarSections={sections}
      sidebarTitle={PAGE_TITLES[activeKey]}
    >
      <Routes>
        <Route path="overview" element={<OverviewPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/:id/edit" element={<EditProductPage />} />
        <Route path="products/:id" element={<ProductDetailAdminPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="purchase" element={<PurchaseOrdersPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Admin;