import api from "../config/axios";

export interface RoleSummary {
  id: string;
  name: string;
  isActive: boolean;
}

export interface RolePermission {
  id: string;
  resource: string;
  action: string;
  isActive: boolean;
}

export interface RoleDetail {
  id: string;
  name: string;
  isActive: boolean;
  permissions: RolePermission[];
}

export const rolesService = {
  async findAll(): Promise<RoleSummary[]> {
    const { data } = await api.get<RoleSummary[]>("/roles");
    return data;
  },

  async findById(id: string): Promise<RoleDetail> {
    const { data } = await api.get<RoleDetail>(`/roles/${id}`);
    return data;
  },

  async create(name: string): Promise<void> {
    await api.post<void>("/roles", { name });
  },

  async activate(id: string): Promise<void> {
    await api.patch<void>(`/roles/${id}/activate`);
  },

  async deactivate(id: string): Promise<void> {
    await api.patch<void>(`/roles/${id}/deactivate`);
  },

  async updatePermissions(id: string, permissionIds: string[]): Promise<void> {
    await api.post<void>(`/roles/${id}/permissions`, { permissionIds });
  },
};