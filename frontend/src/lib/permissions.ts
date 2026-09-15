import type { ResourcePageKey } from "./resourcePath";
import type { UserProfile } from "../store/useAuthStore";

export type DepartmentCode = "sales" | "warehouse";

export const SALES_EMPLOYEE_PAGES: ResourcePageKey[] = [
  "orders",
  "products",
  "categories",
  "pos",
];

export const WAREHOUSE_EMPLOYEE_PAGES: ResourcePageKey[] = [
  "suppliers",
  "purchase",
  "inventory",
  "stock-adjustments",
];

export const ADMIN_PAGES: ResourcePageKey[] = [
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
];

export function isAdmin(user: UserProfile | null): boolean {
  return user?.role === "admin";
}

export function isManager(user: UserProfile | null): boolean {
  return user?.position === "manager";
}

export function canWriteCatalog(user: UserProfile | null): boolean {
  return isAdmin(user) || isManager(user);
}

export function canWriteSuppliers(user: UserProfile | null): boolean {
  return isAdmin(user) || isManager(user);
}

export function getAccessibleAdminPages(
  user: UserProfile | null,
): ResourcePageKey[] {
  if (isAdmin(user)) {
    return ADMIN_PAGES;
  }

  return [];
}

export function getAccessibleEmployeePages(
  user: UserProfile | null,
): ResourcePageKey[] {
  if (isAdmin(user)) {
    return [];
  }

  switch (user?.departmentCode as DepartmentCode | undefined) {
    case "sales":
      return SALES_EMPLOYEE_PAGES;
    case "warehouse":
      return WAREHOUSE_EMPLOYEE_PAGES;
    default:
      return [];
  }
}

export function getEmployeeLandingPath(user: UserProfile | null): string {
  if (isAdmin(user)) {
    return "/customers";
  }
  switch (user?.departmentCode as DepartmentCode | undefined) {
    case "sales":
      return "/products";
    case "warehouse":
      return "/suppliers";
    default:
      return "/pos";
  }
}

export function getEmployeeRoleTitle(user: UserProfile | null): string {
  if (isAdmin(user)) {
    return "Admin";
  }
  switch (user?.departmentCode as DepartmentCode | undefined) {
    case "sales":
      return "Nhân viên Sales";
    case "warehouse":
      return "Nhân viên Kho";
    default:
      return "Employee";
  }
}