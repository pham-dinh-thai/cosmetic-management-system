import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';

export type IReverseBatchStockRequest = {
  quantity: number;
};

export class ReverseBatchStockUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(
    id: string,
    request: IReverseBatchStockRequest,
  ): Promise<void> {
    const inventory = await this.inventoriesRepository.findById(id);

    if (!inventory) {
      throw new InventoryNotFoundException('id', id);
    }

    const increased = inventory.increaseStock(request.quantity);

    await this.inventoriesRepository.updateBatchQuantities(increased);
  }
}

export const reverseBatchStockUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new ReverseBatchStockUseCase(inventoriesRepository);
