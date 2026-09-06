export interface PurchaseItem {
  variantId: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
}

export interface PurchaseOrder {
  id: string;
  code: string;
  supplierName: string;
  createdDate: string;
  totalAmount: number;
  status: "DRAFT" | "COMPLETED";
}
