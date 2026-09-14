import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';
import { IAdjustBatchStockRequest } from './adjust-batch-stock.request';

export class AdjustBatchStockUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(
    id: string,
    batchId: string,
    request: IAdjustBatchStockRequest,
  ): Promise<void> {
    const inventory = await this.inventoriesRepository.findById(id);

    if (!inventory) {
      throw new InventoryNotFoundException('id', id);
    }

    const batch = inventory.adjustBatchStock(batchId, request.adjustedQuantity);

    await this.inventoriesRepository.updateBatchQuantities([batch]);
  }
}

export const adjustBatchStockUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new AdjustBatchStockUseCase(inventoriesRepository);
