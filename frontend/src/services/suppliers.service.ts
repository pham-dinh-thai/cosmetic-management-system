import type { Supplier } from "../pages/Admin/routes/Suppliers/type";

let mockSuppliers: Supplier[] = [
  { id: "1", code: "NCC-001", name: "Công ty Cổ phần Mỹ phẩm Sài Gòn", phone: "02838321456", email: "contact@saigoncosmetics.vn", address: "123 Nguyễn Trãi, Quận 1, TP.HCM", isActive: true },
  { id: "2", code: "NCC-002", name: "Công ty TNHH Rohto-Mentholatum VN", phone: "02743831900", email: "info@rohto.com.vn", address: "Số 16 VSIP, Đường số 5, KCN VSIP, Bình Dương", isActive: true },
  { id: "3", code: "NCC-003", name: "L'Oréal Vietnam", phone: "02839369999", email: "loreal.vietnam@loreal.com", address: "Tầng 10, Tòa nhà Vincom Center, 72 Lê Thánh Tôn, Quận 1, TP.HCM", isActive: false },
];

export const suppliersService = {
  async getSuppliers(_search?: string): Promise<Supplier[]> {
    return [...mockSuppliers];
  },

  async getSupplierById(id: string): Promise<Supplier> {
    const supplier = mockSuppliers.find(s => s.id === id);
    if (!supplier) throw new Error("Supplier not found");
    return { ...supplier };
  },

  async createSupplier(payload: Partial<Supplier>): Promise<{ id: string }> {
    const newSupplier: Supplier = {
      id: Math.random().toString(36).substr(2, 9),
      code: payload.code || `NCC-00${mockSuppliers.length + 1}`,
      name: payload.name || "",
      phone: payload.phone || "",
      email: payload.email || "",
      address: payload.address || "",
      isActive: payload.isActive !== undefined ? payload.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockSuppliers.push(newSupplier);
    return { id: newSupplier.id };
  },

  async updateSupplier(id: string, payload: Partial<Supplier>): Promise<void> {
    const index = mockSuppliers.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Supplier not found");
    mockSuppliers[index] = { 
      ...mockSuppliers[index], 
      ...payload,
      updatedAt: new Date().toISOString()
    };
  },

  async deleteSupplier(id: string): Promise<void> {
    mockSuppliers = mockSuppliers.filter((s) => s.id !== id);
  },
};
