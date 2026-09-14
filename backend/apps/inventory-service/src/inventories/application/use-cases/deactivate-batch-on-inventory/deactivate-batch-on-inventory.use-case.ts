import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';

export class DeactivateBatchOnInventoryUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(id: string, batchId: string): Promise<void> {
    const inventory = await this.inventoriesRepository.findById(id);

    if (!inventory) {
      throw new InventoryNotFoundException('id', id);
    }

    const batch = inventory.deactivateBatch(batchId);
  }
}

export const deactivateBatchOnInventoryUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new DeactivateBatchOnInventoryUseCase(inventoriesRepository);
