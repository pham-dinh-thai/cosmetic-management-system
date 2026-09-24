import type { ResourcePageKey } from "./resourcePath";
import type { UserProfile } from "../store/useAuthStore";

/** Trang dành cho admin (được cấp toàn bộ). */
export const ADMIN_PAGES: ResourcePageKey[] = [
  "overview",
  "reports",
  "orders",
  "customers",
  "employees",
  "departments",
  "suppliers",
  "products",
  "categories",
  "purchase",
  "inventory",
  "stock-adjustments",
  "receipts",
  "payments",
  "invoices",
  "audit-logs",
  "roles",
  "pos",
];

/**
 * Permission cần có (phải đủ TẤT CẢ) để non-admin truy cập từng trang.
 * Trang không có trong map là admin-only (reports, customers, employees,
 * departments, audit-logs).
 */
export const PERMISSION_PAGE_MAP: Partial<Record<ResourcePageKey, string[]>> = {
  overview: ["dashboard:overview"],
  "sales-dashboard": ["dashboard:sales"],
  "warehouse-dashboard": ["dashboard:warehouse"],
  "accounting-dashboard": ["dashboard:accounting"],
  orders: ["orders:read"],
  products: ["cosmetics:read"],
  categories: ["categories:read"],
  suppliers: ["suppliers:read"],
  purchase: ["purchase_orders:read"],
  inventory: ["inventory:read"],
  "stock-adjustments": ["stock_adjustments:read"],
  receipts: ["receipts:read"],
  payments: ["payments:read"],
  invoices: ["invoices:read"],
  pos: ["orders:read", "orders:write", "cosmetics:read"],
  roles: ["roles:read"],
};

/** Thứ tự ưu tiên chọn trang đích sau khi đăng nhập. */
const LANDING_PRIORITY: ResourcePageKey[] = [
  "overview",
  "sales-dashboard",
  "warehouse-dashboard",
  "accounting-dashboard",
  "pos",
  "orders",
  "inventory",
  "products",
  "purchase",
  "suppliers",
  "stock-adjustments",
  "receipts",
  "payments",
  "invoices",
  "categories",
  "roles",
];

export function isAdmin(user: UserProfile | null): boolean {
  return user?.role === "admin";
}

/**
 * Admin luôn được phép mọi quyền. Người dùng khác phải có permission trong
 * danh sách permission lấy từ JWT (role của họ được gán trong Phân quyền).
 */
export function hasPermission(
  user: UserProfile | null,
  permission: string,
): boolean {
  if (!user) return false;
  if (isAdmin(user)) return true;
  return (user.permissions ?? []).includes(permission);
}

export function canReadRoles(user: UserProfile | null): boolean {
  return hasPermission(user, "roles:read");
}

export function canWriteRoles(user: UserProfile | null): boolean {
  return hasPermission(user, "roles:write");
}

export function canWritePermissions(user: UserProfile | null): boolean {
  return hasPermission(user, "permissions:write");
}

export function canWriteCatalog(user: UserProfile | null): boolean {
  return hasPermission(user, "categories:write");
}

export function canWriteSuppliers(user: UserProfile | null): boolean {
  return hasPermission(user, "suppliers:write");
}

function canAccessPage(
  user: UserProfile | null,
  page: ResourcePageKey,
): boolean {
  const required = PERMISSION_PAGE_MAP[page];
  if (!required) return false;
  return required.every((permission) => hasPermission(user, permission));
}

/**
 * Danh sách trang người dùng được phép truy cập.
 * Admin: toàn bộ. Non-admin: chỉ trang có đủ permission trong JWT.
 * Không gắn quyền nào => không truy cập được trang nào.
 */
export function getAccessiblePages(user: UserProfile | null): ResourcePageKey[] {
  if (isAdmin(user)) {
    return ADMIN_PAGES;
  }
  return ADMIN_PAGES.filter((page) => canAccessPage(user, page));
}

/**
 * Trang đích sau khi đăng nhập / bấm logo.
 * Admin: /overview. Non-admin: trang đầu tiên có quyền theo thứ tự ưu tiên.
 * Không có quyền nào => về trang chủ bán hàng (không vào được khu quản trị).
 */
export function getLandingPath(user: UserProfile | null): string {
  if (isAdmin(user)) {
    return "/overview";
  }
  const page = LANDING_PRIORITY.find((p) => canAccessPage(user, p));
  return page ? `/${page}` : "/";
}