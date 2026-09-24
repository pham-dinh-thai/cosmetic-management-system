import api from "../config/axios";

export interface PermissionSummary {
  id: string;
  resource: string;
  action: string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export const RESOURCE_OPTIONS = [
  { value: "users", label: "Người dùng" },
  { value: "auth_users", label: "Tài khoản đăng nhập" },
  { value: "customers", label: "Khách hàng" },
  { value: "employees", label: "Nhân viên" },
];

export const ACTION_OPTIONS = [
  { value: "read", label: "Xem" },
  { value: "write", label: "Thêm / Sửa" },
  { value: "delete", label: "Xoá" },
];

export function resourceLabel(resource: string): string {
  return (
    RESOURCE_OPTIONS.find((o) => o.value === resource)?.label ?? resource
  );
}

export function actionLabel(action: string): string {
  return ACTION_OPTIONS.find((o) => o.value === action)?.label ?? action;
}

export const permissionsService = {
  async findAll(): Promise<PermissionSummary[]> {
    const { data } = await api.get<PermissionSummary[]>("/permissions");
    return data;
  },

  async create(resource: string, action: string): Promise<void> {
    await api.post<void>("/permissions", { resource, action });
  },

  async activate(id: string): Promise<void> {
    await api.patch<void>(`/permissions/${id}/activate`);
  },

  async deactivate(id: string): Promise<void> {
    await api.patch<void>(`/permissions/${id}/deactivate`);
  },
};