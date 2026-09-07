import React from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout, { type SidebarSection } from "../../components/DashboardLayout";
import { useAuthStore } from "../../store/useAuthStore";
import {
  getAccessibleEmployeePages,
  getEmployeeLandingPath,
  getEmployeeRoleTitle,
  canWriteSuppliers,
} from "../../lib/permissions";
import NotFound from "../NotFound";

import PosPage from "./routes/POS";
import ProductsPage from "../Admin/routes/Products";
import AddProductPage from "../Admin/routes/AddProduct";
import EditProductPage from "../Admin/routes/EditProduct";
import ProductDetailAdminPage from "../Admin/routes/ProductDetailAdmin";
import CategoriesPage from "../Admin/routes/Categories";
import SuppliersPage from "../Admin/routes/Suppliers";
import AddSupplierPage from "../Admin/routes/AddSupplier";
import EditSupplierPage from "../Admin/routes/EditSupplier";
import PurchaseOrdersPage from "../Admin/routes/PurchaseOrders";
import AddPurchaseOrderPage from "../Admin/routes/AddPurchaseOrder";
import EditPurchaseOrderPage from "../Admin/routes/EditPurchaseOrder";
import InventoryPage from "../Admin/routes/Inventory";
import AddInventoryPage from "../Admin/routes/AddInventory";
import EditInventoryPage from "../Admin/routes/EditInventory";

export type EmployeePageKey =
  | "pos"
  | "products"
  | "categories"
  | "suppliers"
  | "purchase"
  | "inventory";

const getActiveKey = (pathname: string): EmployeePageKey => {
  if (pathname.includes("/employee/products")) return "products";
  if (pathname.includes("/employee/categories")) return "categories";
  if (pathname.includes("/employee/suppliers")) return "suppliers";
  if (pathname.includes("/employee/purchase")) return "purchase";
  if (pathname.includes("/employee/inventory")) return "inventory";
  return "pos";
};

const PAGE_TITLES: Record<EmployeePageKey, string> = {
  pos: "Bán hàng",
  products: "Sản phẩm",
  categories: "Danh mục",
  suppliers: "Nhà cung cấp",
  purchase: "Nhập hàng",
  inventory: "Kho",
};

const buildSections = (
  active: EmployeePageKey,
  accessible: EmployeePageKey[],
): SidebarSection[] => {
  const sections: SidebarSection[] = [];

  if (accessible.includes("products") || accessible.includes("categories")) {
    sections.push({
      id: "catalog",
      title: "Sản phẩm",
      items: [
        ...(accessible.includes("products")
          ? [{ id: "products", label: "Sản phẩm", active: active === "products" }]
          : []),
        ...(accessible.includes("categories")
          ? [{ id: "categories", label: "Danh mục", active: active === "categories" }]
          : []),
      ],
    });
  }

  if (
    accessible.includes("suppliers") ||
    accessible.includes("purchase") ||
    accessible.includes("inventory")
  ) {
    sections.push({
      id: "warehouse",
      title: "Kho & Nhập hàng",
      items: [
        ...(accessible.includes("suppliers")
          ? [{ id: "suppliers", label: "Nhà cung cấp", active: active === "suppliers" }]
          : []),
        ...(accessible.includes("purchase")
          ? [{ id: "purchase", label: "Nhập hàng", active: active === "purchase" }]
          : []),
        ...(accessible.includes("inventory")
          ? [{ id: "inventory", label: "Kho", active: active === "inventory" }]
          : []),
      ],
    });
  }

  if (accessible.includes("pos")) {
    sections.push({
      id: "sales",
      title: "Bán hàng",
      items: [{ id: "pos", label: "Tạo hoá đơn", active: active === "pos" }],
    });
  }

  return sections;
};

const Employee: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const accessible = getAccessibleEmployeePages(user);
  const activeKey = getActiveKey(location.pathname);
  const landingPath = getEmployeeLandingPath(user);

  if (landingPath.startsWith("/admin")) {
    return <NotFound />;
  }

  if (accessible.length === 0) {
    return <NotFound />;
  }

  if (!accessible.includes(activeKey)) {
    return <Navigate to={landingPath} replace />;
  }

  const sections = buildSections(activeKey, accessible).map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      onClick: () => navigate(`/employee/${item.id}`),
    })),
  }));

  return (
    <DashboardLayout
      roleTitle={getEmployeeRoleTitle(user)}
      sidebarSections={sections}
      sidebarTitle={PAGE_TITLES[activeKey]}
    >
      <Routes>
        <Route path="pos" element={<PosPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/:id/edit" element={<EditProductPage />} />
        <Route path="products/:id" element={<ProductDetailAdminPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="suppliers" element={<SuppliersPage />} />
        <Route
          path="suppliers/add"
          element={canWriteSuppliers(user) ? <AddSupplierPage /> : <NotFound />}
        />
        <Route
          path="suppliers/:id/edit"
          element={canWriteSuppliers(user) ? <EditSupplierPage /> : <NotFound />}
        />
        <Route path="purchase" element={<PurchaseOrdersPage />} />
        <Route path="purchase/add" element={<AddPurchaseOrderPage />} />
        <Route path="purchase/:id/edit" element={<EditPurchaseOrderPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="inventory/add" element={<AddInventoryPage />} />
        <Route path="inventory/:id/edit" element={<EditInventoryPage />} />
        <Route path="*" element={<Navigate to={landingPath} replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default Employee;