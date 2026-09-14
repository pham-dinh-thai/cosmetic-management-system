import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';

export class ActivateInventoryUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const inventory = await this.inventoriesRepository.findById(id);

    if (!inventory) {
      throw new InventoryNotFoundException('id', id);
    }

    inventory.activate();

    await this.inventoriesRepository.setIsActive(inventory);
  }
}

export const activateInventoryUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new ActivateInventoryUseCase(inventoriesRepository);
