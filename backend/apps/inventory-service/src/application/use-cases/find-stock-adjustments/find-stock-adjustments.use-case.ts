import { StockAdjustmentReadModel } from './read-models/stock-adjustment.read-model';
import {
  AdjustStockFilters,
  IStockAdjustmentRepository,
} from '../../../domain/repositories/stock-adjustment.repository';

export class FindStockAdjustmentsUseCase {
  public constructor(
    private readonly stockAdjustmentRepository: IStockAdjustmentRepository,
  ) {}

  public async execute(
    filters: AdjustStockFilters,
  ): Promise<StockAdjustmentReadModel[]> {
    const adjustments = await this.stockAdjustmentRepository.findAll(filters);

    return adjustments.map(
      (adjustment) =>
        new StockAdjustmentReadModel(
          adjustment.getId(),
          adjustment.getInventoryId(),
          adjustment.getVariantId(),
          adjustment.getAdjustment(),
          adjustment.getReason(),
          adjustment.getNote(),
          adjustment.getCreatedBy(),
          adjustment.getCreatedAt(),
        ),
    );
  }
}

export const findStockAdjustmentsUseCaseFactory = (
  stockAdjustmentRepository: IStockAdjustmentRepository,
): FindStockAdjustmentsUseCase =>
  new FindStockAdjustmentsUseCase(stockAdjustmentRepository);
