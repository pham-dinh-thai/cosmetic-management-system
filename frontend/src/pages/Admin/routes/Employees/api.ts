import type { Employee } from "./type";

export const employeesApi = {
  fetchEmployees: async (): Promise<Employee[]> => {
    return [
      { id: "1", code: "NV-001", name: "Nguyễn Thu Hà", role: "Quản lý kho", phone: "0911223344", email: "ha.nguyen@guardian.com", status: "ACTIVE" },
      { id: "2", code: "NV-002", name: "Phạm Minh Tuấn", role: "Nhân viên bán hàng", phone: "0922334455", email: "tuan.pham@guardian.com", status: "ACTIVE" },
      { id: "3", code: "NV-003", name: "Hoàng Ngọc Anh", role: "Kế toán", phone: "0933445566", email: "anh.hoang@guardian.com", status: "INACTIVE" },
    ];
  },
};
