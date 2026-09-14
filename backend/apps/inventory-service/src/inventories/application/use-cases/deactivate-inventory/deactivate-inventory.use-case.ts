import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';

export class DeactivateInventoryUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const inventory = await this.inventoriesRepository.findById(id);

    if (!inventory) {
      throw new InventoryNotFoundException('id', id);
    }

    inventory.deactivate();

    await this.inventoriesRepository.setIsActive(inventory);
  }
}

export const deactivateInventoryUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new DeactivateInventoryUseCase(inventoriesRepository);
