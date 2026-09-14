import { StockAdjustment } from '../stock-adjustment.aggregate';
import { StockAdjustmentReason } from '../types';

export type FindStockAdjustmentsFilters = {
  variantId?: string;
  batchId?: string;
  reason?: StockAdjustmentReason;
};

export type RecordStockAdjustmentResult = {
  id: string;
};

export interface IStockAdjustmentRepository {
  recordAdjustment(
    adjustment: StockAdjustment,
  ): Promise<RecordStockAdjustmentResult>;

  findAll(filters: FindStockAdjustmentsFilters): Promise<StockAdjustment[]>;
}

export const STOCK_ADJUSTMENT_REPOSITORY = 'IStockAdjustmentRepository';