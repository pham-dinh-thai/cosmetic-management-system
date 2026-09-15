import React from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout, { type SidebarSection } from "../../components/DashboardLayout";
import { useAuthStore } from "../../store/useAuthStore";
import {
  isAdmin,
  getAccessibleEmployeePages,
  getEmployeeLandingPath,
  getEmployeeRoleTitle,
  ADMIN_PAGES,
} from "../../lib/permissions";
import { getActiveKey, type ResourcePageKey } from "../../lib/resourcePath";
import NotFound from "../NotFound";

const PAGE_TITLES: Record<ResourcePageKey, string> = {
  overview: "Tổng quan",
  orders: "Đơn hàng",
  customers: "Khách hàng",
  employees: "Nhân viên",
  departments: "Phòng ban",
  suppliers: "Nhà cung cấp",
  products: "Sản phẩm",
  categories: "Danh mục",
  purchase: "Nhập hàng",
  inventory: "Kho",
  "stock-adjustments": "Điều chỉnh kho",
  pos: "Bán hàng",
};

const ADMIN_SECTIONS: (active: ResourcePageKey) => SidebarSection[] = (
  active,
) => [
  {
    id: "overview-group",
    title: "Tổng quan",
    items: [
      { id: "overview", label: "Bảng điều khiển", active: active === "overview" },
    ],
  },
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
      {
        id: "stock-adjustments",
        label: "Điều chỉnh kho",
        active: active === "stock-adjustments",
      },
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

const buildEmployeeSections = (
  active: ResourcePageKey,
  accessible: ResourcePageKey[],
): SidebarSection[] => {
  const sections: SidebarSection[] = [];

  const salesItems: SidebarSection["items"] = [];
  if (accessible.includes("orders")) {
    salesItems.push({ id: "orders", label: "Đơn hàng", active: active === "orders" });
  }
  if (accessible.includes("products")) {
    salesItems.push({ id: "products", label: "Sản phẩm", active: active === "products" });
  }
  if (accessible.includes("categories")) {
    salesItems.push({ id: "categories", label: "Danh mục", active: active === "categories" });
  }

  if (salesItems.length > 0) {
    sections.push({
      id: "sales",
      title: "Kinh doanh",
      items: salesItems,
    });
  }

  if (
    accessible.includes("suppliers") ||
    accessible.includes("purchase") ||
    accessible.includes("inventory") ||
    accessible.includes("stock-adjustments")
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
        ...(accessible.includes("stock-adjustments")
          ? [
              {
                id: "stock-adjustments",
                label: "Điều chỉnh kho",
                active: active === "stock-adjustments",
              },
            ]
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

const Resources: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const admin = isAdmin(user);
  const accessible: ResourcePageKey[] = admin
    ? ADMIN_PAGES
    : getAccessibleEmployeePages(user);

  const activeKey = getActiveKey(location.pathname);
  const landingPath = getEmployeeLandingPath(user);

  if (!admin && accessible.length === 0) {
    return <NotFound />;
  }

  if (!activeKey || !accessible.includes(activeKey)) {
    return <Navigate to={landingPath} replace />;
  }

  const sections = (
    admin ? ADMIN_SECTIONS(activeKey) : buildEmployeeSections(activeKey, accessible)
  ).map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      onClick: () => navigate(`/${item.id}`),
    })),
  }));

  return (
    <DashboardLayout
      roleTitle={admin ? "Admin" : getEmployeeRoleTitle(user)}
      sidebarSections={sections}
      sidebarTitle={PAGE_TITLES[activeKey]}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default Resources;