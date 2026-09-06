import type { Department } from "../pages/Admin/routes/Departments/type";

let mockDepartments: Department[] = [
  { id: "1", code: "PB-001", name: "Phòng Kinh doanh", managerId: "2", positions: ["Quản lý", "Nhân viên bán hàng", "Thực tập sinh"], isActive: true },
  { id: "2", code: "PB-002", name: "Phòng Kế toán", managerId: "3", positions: ["Kế toán trưởng", "Kế toán viên"], isActive: true },
  { id: "3", code: "PB-003", name: "Phòng Nhân sự", managerId: null, positions: ["Trưởng phòng", "Chuyên viên tuyển dụng"], isActive: true },
];

export const departmentsService = {
  async getDepartments(_search?: string): Promise<Department[]> {
    return [...mockDepartments];
  },

  async getDepartmentById(id: string): Promise<Department> {
    const department = mockDepartments.find(d => d.id === id);
    if (!department) throw new Error("Department not found");
    return { ...department };
  },

  async createDepartment(payload: Partial<Department>): Promise<{ id: string }> {
    const newDepartment: Department = {
      id: Math.random().toString(36).substr(2, 9),
      code: payload.code || `PB-00${mockDepartments.length + 1}`,
      name: payload.name || "",
      managerId: payload.managerId || null,
      positions: payload.positions || [],
      isActive: payload.isActive !== undefined ? payload.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDepartments.push(newDepartment);
    return { id: newDepartment.id };
  },

  async updateDepartment(id: string, payload: Partial<Department>): Promise<void> {
    const index = mockDepartments.findIndex((d) => d.id === id);
    if (index === -1) throw new Error("Department not found");
    mockDepartments[index] = { 
      ...mockDepartments[index], 
      ...payload,
      updatedAt: new Date().toISOString()
    };
  },

  async deleteDepartment(id: string): Promise<void> {
    mockDepartments = mockDepartments.filter((d) => d.id !== id);
  },
};
