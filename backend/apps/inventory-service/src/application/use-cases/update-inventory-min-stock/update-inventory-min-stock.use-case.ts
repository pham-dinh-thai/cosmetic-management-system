import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { type IInventoryRepository } from '../../../domain/repositories/inventory.repository';

export class UpdateInventoryMinStockUseCase {
  public constructor(
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  public async execute(
    id: string,
    minStock: number,
  ): Promise<{ id: string; minStock: number }> {
    const inventory = await this.inventoryRepository.updateMinStock(
      id,
      minStock,
    );

    if (!inventory) {
      throw new InventoryNotFoundException(id);
    }

    return { id: inventory.getId(), minStock: inventory.getMinStock() };
  }
}

export const updateInventoryMinStockUseCaseFactory = (
  inventoryRepository: IInventoryRepository,
): UpdateInventoryMinStockUseCase =>
  new UpdateInventoryMinStockUseCase(inventoryRepository);