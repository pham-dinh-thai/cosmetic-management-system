import React from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout, { type SidebarSection } from "../../components/DashboardLayout";
import { useAuthStore } from "../../store/useAuthStore";
import { isAdmin } from "../../lib/permissions";
import NotFound from "../NotFound";

import CustomersPage from "./routes/Customers";
import AddCustomerPage from "./routes/AddCustomer";
import EditCustomerPage from "./routes/EditCustomer";
import EmployeesPage from "./routes/Employees";
import AddEmployeePage from "./routes/AddEmployee";
import EditEmployeePage from "./routes/EditEmployee";
import DepartmentsPage from "./routes/Departments";
import AddDepartmentPage from "./routes/AddDepartment";
import EditDepartmentPage from "./routes/EditDepartment";
import SuppliersPage from "./routes/Suppliers";
import AddSupplierPage from "./routes/AddSupplier";
import EditSupplierPage from "./routes/EditSupplier";
import ProductsPage from "./routes/Products";
import AddProductPage from "./routes/AddProduct";
import EditProductPage from "./routes/EditProduct";
import ProductDetailAdminPage from "./routes/ProductDetailAdmin";
import CategoriesPage from "./routes/Categories";
import PurchaseOrdersPage from "./routes/PurchaseOrders";
import AddPurchaseOrderPage from "./routes/AddPurchaseOrder";
import EditPurchaseOrderPage from "./routes/EditPurchaseOrder";
import InventoryPage from "./routes/Inventory";
import AddInventoryPage from "./routes/AddInventory";
import EditInventoryPage from "./routes/EditInventory";
import InventoryDetailPage from "./routes/InventoryDetail";
import ImportPurchaseOrderPage from "./routes/ImportPurchaseOrder";
import OrdersPage from "./routes/Orders";

export type AdminPageKey =
  | "orders"
  | "customers"
  | "employees"
  | "departments"
  | "suppliers"
  | "products"
  | "categories"
  | "purchase"
  | "inventory";

const getActiveKey = (pathname: string): AdminPageKey => {
  if (pathname.includes("/admin/orders")) return "orders";
  if (pathname.includes("/admin/customers")) return "customers";
  if (pathname.includes("/admin/employees")) return "employees";
  if (pathname.includes("/admin/departments")) return "departments";
  if (pathname.includes("/admin/suppliers")) return "suppliers";
  if (pathname.includes("/admin/products")) return "products";
  if (pathname.includes("/admin/categories")) return "categories";
  if (pathname.includes("/admin/purchase")) return "purchase";
  if (pathname.includes("/admin/inventory")) return "inventory";
  return "customers";
};

const PAGE_TITLES: Record<AdminPageKey, string> = {
  orders: "Đơn hàng",
  customers: "Khách hàng",
  employees: "Nhân viên",
  departments: "Phòng ban",
  suppliers: "Nhà cung cấp",
  products: "Sản phẩm",
  categories: "Danh mục",
  purchase: "Nhập hàng",
  inventory: "Kho",
};

const ALL_SECTIONS: (active: AdminPageKey) => SidebarSection[] = (
  active,
) => [
  {
    id: "sales",
    title: "Bán hàng",
    items: [
      { id: "orders", label: "Đơn hàng", active: active === "orders" },
      { id: "products", label: "Sản phẩm", active: active === "products" },
      { id: "categories", label: "Danh mục", active: active === "categories" },
    ],
  },
  {
    id: "warehouse",
    title: "Kho",
    items: [
      { id: "suppliers", label: "Nhà cung cấp", active: active === "suppliers" },
      { id: "purchase", label: "Nhập hàng", active: active === "purchase" },
      { id: "inventory", label: "Kho", active: active === "inventory" },
    ],
  },
  {
    id: "management",
    title: "Quản trị",
    items: [
      { id: "customers", label: "Khách hàng", active: active === "customers" },
      { id: "employees", label: "Nhân viên", active: active === "employees" },
      { id: "departments", label: "Phòng ban", active: active === "departments" },
    ],
  },
];

const Admin: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  if (!isAdmin(user)) {
    return <NotFound />;
  }

  const activeKey = getActiveKey(location.pathname);

  const sections = ALL_SECTIONS(activeKey).map((section) => ({
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
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="customers/add" element={<AddCustomerPage />} />
        <Route path="customers/:id/edit" element={<EditCustomerPage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employees/add" element={<AddEmployeePage />} />
        <Route path="employees/:id/edit" element={<EditEmployeePage />} />
        <Route path="departments" element={<DepartmentsPage />} />
        <Route path="departments/add" element={<AddDepartmentPage />} />
        <Route path="departments/:id/edit" element={<EditDepartmentPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route path="suppliers/add" element={<AddSupplierPage />} />
        <Route path="suppliers/:id/edit" element={<EditSupplierPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/:id/edit" element={<EditProductPage />} />
        <Route path="products/:id" element={<ProductDetailAdminPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="purchase" element={<PurchaseOrdersPage />} />
        <Route path="purchase/add" element={<AddPurchaseOrderPage />} />
        <Route path="purchase/:id/edit" element={<EditPurchaseOrderPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="inventory/import" element={<ImportPurchaseOrderPage />} />
        <Route path="inventory/add" element={<AddInventoryPage />} />
        <Route path="inventory/:id/edit" element={<EditInventoryPage />} />
        <Route path="inventory/:id" element={<InventoryDetailPage />} />
        <Route path="*" element={<Navigate to="/admin/customers" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Admin;