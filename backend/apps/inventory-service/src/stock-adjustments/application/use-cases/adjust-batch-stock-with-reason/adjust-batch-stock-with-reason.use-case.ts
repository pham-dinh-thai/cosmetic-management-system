import { InventoryNotFoundException } from '../../../../inventories/domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../../inventories/domain/repositories/inventories.repository';
import { StockAdjustment } from '../../../domain/stock-adjustment.aggregate';
import { IStockAdjustmentRepository } from '../../../domain/repositories/stock-adjustments.repository';
import {
  IAdjustBatchStockWithReasonRequest,
  IAdjustBatchStockWithReasonResult,
} from './adjust-batch-stock-with-reason.request';

export class AdjustBatchStockWithReasonUseCase {
  public constructor(
    private readonly stockAdjustmentRepository: IStockAdjustmentRepository,
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(
    batchId: string,
    request: IAdjustBatchStockWithReasonRequest,
    createdBy: string,
  ): Promise<IAdjustBatchStockWithReasonResult> {
    const inventory = await this.inventoriesRepository.findByBatchId(batchId);

    if (!inventory) {
      throw new InventoryNotFoundException('batchId', batchId);
    }

    const batch = inventory.applyStockAdjustment(batchId, request.adjustment);

    await this.inventoriesRepository.updateBatchQuantities([batch]);

    const adjustment = StockAdjustment.create({
      batchId: batch.getId(),
      variantId: inventory.getVariantId(),
      adjustment: request.adjustment,
      reason: request.reason,
      note: request.note ?? null,
      createdBy,
    });

    const result = await this.stockAdjustmentRepository.recordAdjustment(
      adjustment,
    );

    return {
      id: result.id,
      batchId,
      variantId: inventory.getVariantId(),
      quantity: batch.getQuantity(),
    };
  }
}

export const adjustBatchStockWithReasonUseCaseFactory = (
  stockAdjustmentRepository: IStockAdjustmentRepository,
  inventoriesRepository: IInventoriesRepository,
): AdjustBatchStockWithReasonUseCase =>
  new AdjustBatchStockWithReasonUseCase(
    stockAdjustmentRepository,
    inventoriesRepository,
  );