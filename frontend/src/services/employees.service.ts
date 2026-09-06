import type { Employee } from "../pages/Admin/routes/Employees/type";

let mockEmployees: Employee[] = [
  { id: "1", code: "NV-001", name: "Nguyễn Thu Hà", position: "Quản lý kho", phone: "0911223344", email: "ha.nguyen@guardian.com", address: "Hà Nội", departmentId: "D-01", hiredAt: "2024-01-15", status: "ACTIVE" },
  { id: "2", code: "NV-002", name: "Phạm Minh Tuấn", position: "Nhân viên bán hàng", phone: "0922334455", email: "tuan.pham@guardian.com", address: "Hồ Chí Minh", departmentId: "D-02", hiredAt: "2024-02-20", status: "ACTIVE" },
  { id: "3", code: "NV-003", name: "Hoàng Ngọc Anh", position: "Kế toán", phone: "0933445566", email: "anh.hoang@guardian.com", address: "Đà Nẵng", departmentId: "D-03", hiredAt: "2023-11-05", status: "INACTIVE" },
];

export const employeesService = {
  async getEmployees(_search?: string): Promise<Employee[]> {
    return [...mockEmployees];
  },

  async getEmployeeById(id: string): Promise<Employee> {
    const employee = mockEmployees.find(e => e.id === id);
    if (!employee) throw new Error("Employee not found");
    return { ...employee };
  },

  async createEmployee(payload: Partial<Employee>): Promise<{ id: string }> {
    const newEmployee: Employee = {
      id: Math.random().toString(36).substr(2, 9),
      code: payload.code || `NV-00${mockEmployees.length + 1}`,
      name: payload.name || "",
      phone: payload.phone || "",
      email: payload.email || "",
      address: payload.address || "",
      departmentId: payload.departmentId || "",
      position: payload.position || "",
      hiredAt: payload.hiredAt || new Date().toISOString().split('T')[0],
      status: payload.status || "ACTIVE",
    };
    mockEmployees.push(newEmployee);
    return { id: newEmployee.id };
  },

  async updateEmployee(id: string, payload: Partial<Employee>): Promise<void> {
    const index = mockEmployees.findIndex((e) => e.id === id);
    if (index === -1) throw new Error("Employee not found");
    mockEmployees[index] = { ...mockEmployees[index], ...payload };
  },

  async deleteEmployee(id: string): Promise<void> {
    mockEmployees = mockEmployees.filter((e) => e.id !== id);
  },
};
