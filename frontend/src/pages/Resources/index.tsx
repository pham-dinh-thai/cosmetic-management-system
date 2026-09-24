import React from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import DashboardLayout, { type SidebarSection } from "../../components/DashboardLayout";
import { useAuthStore } from "../../store/useAuthStore";
import {
  isAdmin,
  getAccessiblePages,
  getLandingPath,
} from "../../lib/permissions";
import { getActiveKey, type ResourcePageKey } from "../../lib/resourcePath";
import NotFound from "../NotFound";

const PAGE_TITLES: Record<ResourcePageKey, string> = {
  overview: "Tổng quan",
  reports: "Báo cáo thống kê",
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
  receipts: "Phiếu thu",
  payments: "Phiếu chi",
  invoices: "Công nợ",
  "audit-logs": "Nhật ký hoạt động",
  roles: "Phân quyền",
  pos: "Bán hàng",
};

interface SectionDef {
  id: string;
  title: string;
  items: { id: ResourcePageKey; label: string }[];
}

const SECTION_DEFS: SectionDef[] = [
  {
    id: "overview-group",
    title: "Tổng quan",
    items: [
      { id: "overview", label: "Bảng điều khiển" },
      { id: "reports", label: "Báo cáo thống kê" },
    ],
  },
  {
    id: "sales",
    title: "Bán hàng",
    items: [
      { id: "orders", label: "Đơn hàng" },
      { id: "products", label: "Sản phẩm" },
      { id: "categories", label: "Danh mục" },
      { id: "pos", label: "Tạo hoá đơn" },
    ],
  },
  {
    id: "warehouse",
    title: "Kho",
    items: [
      { id: "suppliers", label: "Nhà cung cấp" },
      { id: "purchase", label: "Nhập hàng" },
      { id: "inventory", label: "Kho" },
      { id: "stock-adjustments", label: "Điều chỉnh kho" },
    ],
  },
  {
    id: "accounting",
    title: "Thu chi",
    items: [
      { id: "invoices", label: "Công nợ" },
      { id: "receipts", label: "Phiếu thu" },
      { id: "payments", label: "Phiếu chi" },
    ],
  },
  {
    id: "management",
    title: "Quản trị",
    items: [
      { id: "customers", label: "Khách hàng" },
      { id: "employees", label: "Nhân viên" },
      { id: "departments", label: "Phòng ban" },
      { id: "audit-logs", label: "Nhật ký hoạt động" },
      { id: "roles", label: "Phân quyền" },
    ],
  },
];

const buildSections = (
  active: ResourcePageKey,
  accessible: ResourcePageKey[],
): SidebarSection[] =>
  SECTION_DEFS.map((section) => ({
    id: section.id,
    title: section.title,
    items: section.items
      .filter((item) => accessible.includes(item.id))
      .map((item) => ({ id: item.id, label: item.label, active: active === item.id })),
  })).filter((section) => section.items.length > 0);

const Resources: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const admin = isAdmin(user);
  const accessible = getAccessiblePages(user);
  const activeKey = getActiveKey(location.pathname);
  const landingPath = getLandingPath(user);

  if (!admin && accessible.length === 0) {
    return <NotFound />;
  }

  if (!activeKey || !accessible.includes(activeKey)) {
    return <Navigate to={landingPath} replace />;
  }

  const sections = buildSections(activeKey, accessible).map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      onClick: () => navigate(`/${item.id}`),
    })),
  }));

  return (
    <DashboardLayout
      roleTitle={admin ? "Admin" : "Nhân viên"}
      sidebarSections={sections}
      sidebarTitle={PAGE_TITLES[activeKey]}
    >
      <Outlet />
    </DashboardLayout>
  );
};

export default Resources;