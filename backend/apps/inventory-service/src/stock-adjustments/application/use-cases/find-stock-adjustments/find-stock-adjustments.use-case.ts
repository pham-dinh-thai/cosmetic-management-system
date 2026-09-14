import { IStockAdjustmentRepository } from '../../../domain/repositories/stock-adjustments.repository';
import { FindStockAdjustmentsFilters } from '../../../domain/repositories/stock-adjustments.repository';
import { StockAdjustmentReadModel } from './read-models/stock-adjustment.read-model';

export class FindStockAdjustmentsUseCase {
  public constructor(
    private readonly stockAdjustmentRepository: IStockAdjustmentRepository,
  ) {}

  public async execute(
    filters: FindStockAdjustmentsFilters,
  ): Promise<StockAdjustmentReadModel[]> {
    const adjustments = await this.stockAdjustmentRepository.findAll(filters);

    return adjustments.map(
      (adjustment) =>
        new StockAdjustmentReadModel(
          adjustment.getId(),
          adjustment.getBatchId(),
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