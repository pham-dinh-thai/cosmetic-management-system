import type { Customer } from "./type";

export const customersApi = {
  fetchCustomers: async (): Promise<Customer[]> => {
    return [
      { id: "1", code: "KH-001", name: "Nguyễn Văn A", phone: "0901234567", email: "nva@gmail.com", orders: 5, totalSpent: 1250000 },
      { id: "2", code: "KH-002", name: "Trần Thị B", phone: "0912345678", email: "ttb@gmail.com", orders: 3, totalSpent: 850000 },
      { id: "3", code: "KH-003", name: "Lê Hoàng C", phone: "0987654321", email: "lhc@gmail.com", orders: 12, totalSpent: 4200000 },
    ];
  },
};
