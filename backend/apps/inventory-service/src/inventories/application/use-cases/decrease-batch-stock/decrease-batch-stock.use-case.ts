import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';
import { IDecreaseBatchStockRequest } from './decrease-batch-stock.request';

export type BatchDeductionDTO = {
  batchId: string;
  quantity: number;
};

export class DecreaseBatchStockUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(
    id: string,
    request: IDecreaseBatchStockRequest,
  ): Promise<BatchDeductionDTO[]> {
    const inventory = await this.inventoriesRepository.findById(id);

    if (!inventory) {
      throw new InventoryNotFoundException('id', id);
    }

    const deducted = inventory.decreaseStock(request.requestedQuantity);

    await this.inventoriesRepository.updateBatchQuantities(
      deducted.map((d) => d.batch),
    );

    return deducted.map((d) => ({
      batchId: d.batch.getId(),
      quantity: d.quantity,
    }));
  }
}

export const decreaseBatchStockUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new DecreaseBatchStockUseCase(inventoriesRepository);
