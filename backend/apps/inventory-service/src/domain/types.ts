export const STOCK_ADJUSTMENT_REASONS = [
  'DAMAGED',
  'DEFECTIVE',
  'EXPIRED',
  'OVERSTOCK',
  'OTHER',
] as const;

export type StockAdjustmentReason = (typeof STOCK_ADJUSTMENT_REASONS)[number];

export type CreateInventoryProps = {
  variantId: string;
  quantity: number;
  expiryDate?: Date;
};

export type FromPersistentInventoryProps = {
  id: string;
  variantId: string;
  quantity: number;
  expiryDate?: Date;
  lastUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};
