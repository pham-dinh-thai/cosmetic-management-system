import type { PurchaseOrder } from "./type";

export const purchaseOrdersApi = {
  fetchOrders: async (): Promise<PurchaseOrder[]> => {
    return [
      { id: "1", code: "PN-2026-001", supplierName: "Công ty Dược Mỹ Phẩm L'Oréal VN", createdDate: "05/09/2026", totalAmount: 45000000, status: "COMPLETED" },
      { id: "2", code: "PN-2026-002", supplierName: "Nhà phân phối Mỹ phẩm Cocoon", createdDate: "06/09/2026", totalAmount: 18500000, status: "DRAFT" },
    ];
  },
};
