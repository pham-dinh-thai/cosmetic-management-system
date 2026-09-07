export type PurchaseOrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export interface PurchaseOrder {
  id: string;
  code: string;
  supplierId: string;
  supplierName: string;
  createdDate: string;
  totalAmount: number;
  status: PurchaseOrderStatus;
}