import type { AdminPageKey } from "../pages/Admin";
import type { EmployeePageKey } from "../pages/Employee";
import type { UserProfile } from "../store/useAuthStore";

export type DepartmentCode = "sales" | "warehouse";

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
): AdminPageKey[] {
  if (isAdmin(user)) {
    return [
      "customers",
      "employees",
      "departments",
      "suppliers",
      "products",
      "categories",
      "purchase",
      "inventory",
    ];
  }

  return [];
}

export function getAccessibleEmployeePages(
  user: UserProfile | null,
): EmployeePageKey[] {
  if (isAdmin(user)) {
    return [];
  }

  switch (user?.departmentCode as DepartmentCode | undefined) {
    case "sales":
      return ["products", "categories", "pos"];
    case "warehouse":
      return ["suppliers", "purchase", "inventory"];
    default:
      return [];
  }
}

export function getEmployeeLandingPath(user: UserProfile | null): string {
  if (isAdmin(user)) {
    return "/admin/customers";
  }
  switch (user?.departmentCode as DepartmentCode | undefined) {
    case "sales":
      return "/employee/products";
    case "warehouse":
      return "/employee/suppliers";
    default:
      return "/employee/pos";
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