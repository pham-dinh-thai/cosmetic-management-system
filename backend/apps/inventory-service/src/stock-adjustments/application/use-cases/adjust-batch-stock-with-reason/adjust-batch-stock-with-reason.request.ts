import { StockAdjustmentReason } from '../../../domain/types';

export type IAdjustBatchStockWithReasonRequest = {
  adjustment: number;
  reason: StockAdjustmentReason;
  note?: string;
};

export type IAdjustBatchStockWithReasonResult = {
  id: string;
  batchId: string;
  variantId: string;
  quantity: number;
};