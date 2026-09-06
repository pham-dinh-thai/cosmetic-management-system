import type { Supplier } from "./type";

export const suppliersApi = {
  fetchSuppliers: async (): Promise<Supplier[]> => {
    return [
      { id: "1", code: "NCC-001", name: "Công ty Dược Mỹ Phẩm L'Oréal VN", contactName: "Trần Đức Nam", phone: "02838221100", email: "contact@loreal.vn", address: "Quận 1, TP. Hồ Chí Minh" },
      { id: "2", code: "NCC-002", name: "Nhà phân phối Mỹ phẩm Cocoon", contactName: "Nguyễn Thị Hương", phone: "02873001234", email: "info@cocoon.vn", address: "Quận Tân Bình, TP. Hồ Chí Minh" },
      { id: "3", code: "NCC-003", name: "Tập đoàn Shiseido Việt Nam", contactName: "Đỗ Anh Khoa", phone: "02439345678", email: "support@shiseido.vn", address: "Quận Hoàn Kiếm, Hà Nội" },
    ];
  },
};
