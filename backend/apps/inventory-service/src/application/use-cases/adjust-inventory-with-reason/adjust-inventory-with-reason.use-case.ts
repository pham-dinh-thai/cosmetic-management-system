import { IStockAdjustmentRepository } from '../../../domain/repositories/stock-adjustment.repository';
import {
  STOCK_ADJUSTMENT_REASONS,
  StockAdjustmentReason,
} from '../../../domain/types';
import { InvalidAdjustmentReasonException } from '../../../domain/exceptions/invalid-adjustment-reason.exception';
import { InvalidQuantityException } from '../../../domain/exceptions/invalid-quantity.exception';

export type AdjustInventoryWithReasonInput = {
  variantId: string;
  adjustment: number;
  reason: StockAdjustmentReason;
  note?: string;
  createdBy: string;
};

export type AdjustInventoryWithReasonResult = {
  id: string;
  variantId: string;
  quantity: number;
};

export class AdjustInventoryWithReasonUseCase {
  public constructor(
    private readonly stockAdjustmentRepository: IStockAdjustmentRepository,
  ) {}

  public async execute(
    input: AdjustInventoryWithReasonInput,
  ): Promise<AdjustInventoryWithReasonResult> {
    if (!STOCK_ADJUSTMENT_REASONS.includes(input.reason)) {
      throw new InvalidAdjustmentReasonException(input.reason);
    }

    if (input.adjustment === 0) {
      throw new InvalidQuantityException(
        'Adjustment must not be zero (negative to dispose, positive to restore)',
      );
    }

    return await this.stockAdjustmentRepository.recordAdjustment({
      variantId: input.variantId,
      adjustment: input.adjustment,
      reason: input.reason,
      note: input.note ?? null,
      createdBy: input.createdBy,
    });
  }
}

export const adjustInventoryWithReasonUseCaseFactory = (
  stockAdjustmentRepository: IStockAdjustmentRepository,
): AdjustInventoryWithReasonUseCase =>
  new AdjustInventoryWithReasonUseCase(stockAdjustmentRepository);
