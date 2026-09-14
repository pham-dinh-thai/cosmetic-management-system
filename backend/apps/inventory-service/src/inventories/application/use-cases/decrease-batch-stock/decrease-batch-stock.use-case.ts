import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';
import { IDecreaseBatchStockRequest } from './decrease-batch-stock.request';

export class DecreaseBatchStockUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(
    id: string,
    request: IDecreaseBatchStockRequest,
  ): Promise<void> {
    const inventory = await this.inventoriesRepository.findById(id);

    if (!inventory) {
      throw new InventoryNotFoundException('id', id);
    }

    inventory.decreaseStock(request.requestedQuantity);
  }
}

export const decreaseBatchStockUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new DecreaseBatchStockUseCase(inventoriesRepository);
