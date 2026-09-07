import api from "../config/axios";
import type { Department } from "../pages/Admin/routes/Departments/type";

interface DepartmentDto {
  id: string;
  code: string;
  name: string;
  managerId: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const toDepartment = (dto: DepartmentDto): Department => ({
  id: dto.id,
  code: dto.code,
  name: dto.name,
  managerId: dto.managerId ?? null,
  isActive: dto.isActive,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

export const departmentsService = {
  async getDepartments(_search?: string): Promise<Department[]> {
    const { data } = await api.get<DepartmentDto[]>("/departments");
    return data.map(toDepartment);
  },

  async getDepartmentById(id: string): Promise<Department> {
    const departments = await this.getDepartments();
    const department = departments.find((d) => d.id === id);
    if (!department) throw new Error("Department not found");
    return department;
  },

  async createDepartment(payload: Partial<Department>): Promise<void> {
    await api.post<void>("/departments", {
      code: payload.code,
      name: payload.name,
    });
  },

  async updateDepartment(id: string, payload: Partial<Department>): Promise<void> {
    const current = await this.getDepartmentById(id);
    await api.put<void>(`/departments/${id}`, {
      code: payload.code || current.code,
      name: payload.name,
    });

    if (payload.isActive === false) {
      await this.deactivateDepartment(id);
    } else if (payload.isActive === true) {
      await this.activateDepartment(id);
    }
  },

  async deleteDepartment(id: string): Promise<void> {
    await api.delete<void>(`/departments/${id}`);
  },

  async activateDepartment(id: string): Promise<void> {
    await api.patch<void>(`/departments/${id}/activate`);
  },

  async deactivateDepartment(id: string): Promise<void> {
    await api.patch<void>(`/departments/${id}/deactivate`);
  },
};