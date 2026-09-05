import { StockAdjustment as StockAdjustmentMikro } from '../entities/stock-adjustment.entity';
import { StockAdjustment } from '../../domain/stock-adjustment.aggregate';
import { StockAdjustmentReason } from '../../domain/types';

export class StockAdjustmentMapper {
  public static toDomain(
    adjustmentMikro: StockAdjustmentMikro,
  ): StockAdjustment {
    return StockAdjustment.fromPersistent({
      id: adjustmentMikro.id,
      inventoryId: adjustmentMikro.inventoryId,
      variantId: adjustmentMikro.variantId,
      adjustment: adjustmentMikro.adjustment,
      reason: adjustmentMikro.reason as StockAdjustmentReason,
      note: adjustmentMikro.note ?? null,
      createdBy: adjustmentMikro.createdBy,
      createdAt: adjustmentMikro.createdAt,
      updatedAt: adjustmentMikro.updatedAt,
    });
  }
}
