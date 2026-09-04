export const PurchaseOrderStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type PurchaseOrderStatus =
  (typeof PurchaseOrderStatus)[keyof typeof PurchaseOrderStatus];

export type CreatePurchaseOrderLineProps = {
  variantId: string;
  quantity: number;
  unitPrice: number;
};

export type FromPersistentPurchaseOrderLineProps = {
  id: string;
  purchaseOrderId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePurchaseOrderProps = {
  code: string;
  supplierId: string;
  lines: CreatePurchaseOrderLineProps[];
};

export type FromPersistentPurchaseOrderProps = {
  id: string;
  code: string;
  supplierId: string;
  status: PurchaseOrderStatus;
  totalAmount: number;
  lines: FromPersistentPurchaseOrderLineProps[];
  createdAt: Date;
  updatedAt: Date;
};
