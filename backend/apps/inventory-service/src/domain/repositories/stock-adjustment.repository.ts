import { StockAdjustment } from '../stock-adjustment.aggregate';
import { StockAdjustmentReason } from '../types';

export type AdjustStockFilters = {
  variantId?: string;
  reason?: StockAdjustmentReason;
};

export interface IStockAdjustmentRepository {
  recordAdjustment(input: {
    variantId: string;
    adjustment: number;
    reason: StockAdjustmentReason;
    note: string | null;
    createdBy: string;
  }): Promise<{ id: string; variantId: string; quantity: number }>;
  findAll(filters: AdjustStockFilters): Promise<StockAdjustment[]>;
}

export const STOCK_ADJUSTMENT_REPOSITORY = 'IStockAdjustmentRepository';
