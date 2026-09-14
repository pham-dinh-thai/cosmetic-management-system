import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';

export class ActivateBatchOnInventoryUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(id: string, batchId: string): Promise<void> {
    const inventory = await this.inventoriesRepository.findById(id);

    if (!inventory) {
      throw new InventoryNotFoundException('id', id);
    }

    const batch = inventory.activateBatch(batchId);

    await this.inventoriesRepository.setBatchStatus(batch);
  }
}

export const activateBatchOnInventoryUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new ActivateBatchOnInventoryUseCase(inventoriesRepository);