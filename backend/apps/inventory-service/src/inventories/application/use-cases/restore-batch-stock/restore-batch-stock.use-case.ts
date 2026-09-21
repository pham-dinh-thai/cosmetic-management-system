import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';

export type IRestoreBatchStockRequest = {
  variantId: string;
  quantity: number;
};

export class RestoreBatchStockUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(
    id: string,
    request: IRestoreBatchStockRequest,
  ): Promise<void> {
    const inventory = await this.inventoriesRepository.findById(id);

    if (!inventory) {
      throw new InventoryNotFoundException('id', id);
    }

    const batches = inventory.restoreStock(request.quantity);

    await this.inventoriesRepository.updateBatchQuantities(batches);
  }
}

export const restoreBatchStockUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new RestoreBatchStockUseCase(inventoriesRepository);
