export const STOCK_ADJUSTMENT_REASONS = [
  'DAMAGED',
  'DEFECTIVE',
  'EXPIRED',
  'OVERSTOCK',
  'OTHER',
] as const;

export type StockAdjustmentReason = (typeof STOCK_ADJUSTMENT_REASONS)[number];

export type CreateStockAdjustmentProps = {
  batchId: string;
  variantId: string;
  adjustment: number;
  reason: StockAdjustmentReason;
  note: string | null;
  createdBy: string;
};

export type FromPersistentStockAdjustmentProps = {
  id: string;
  batchId: string;
  variantId: string;
  adjustment: number;
  reason: StockAdjustmentReason;
  note: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
};