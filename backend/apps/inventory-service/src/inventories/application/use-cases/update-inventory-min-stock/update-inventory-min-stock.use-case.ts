import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';
import { IUpdateInventoryMinStockRequest } from './update-inventory-min-stock.request';

export class UpdateInventoryMinStockUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(
    id: string,
    request: IUpdateInventoryMinStockRequest,
  ): Promise<void> {
    const inventory = await this.inventoriesRepository.findById(id);

    if (!inventory) {
      throw new InventoryNotFoundException('id', id);
    }

    inventory.updateMinStock(request.minStock);

    await this.inventoriesRepository.updateMinStock(inventory);
  }
}

export const updateInventoryMinStockUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new UpdateInventoryMinStockUseCase(inventoriesRepository);
