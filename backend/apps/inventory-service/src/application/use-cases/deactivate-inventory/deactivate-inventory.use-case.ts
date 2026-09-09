import { InventoryNotFoundException } from 'apps/inventory-service/src/domain/exceptions/inventory-not-found.exception';
import { type IInventoryRepository } from 'apps/inventory-service/src/domain/repositories/inventory.repository';

export class DeactivateInventoryUseCase {
  public constructor(
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const inventory = await this.inventoryRepository.deactivate(id);

    if (!inventory) {
      throw new InventoryNotFoundException(id);
    }
  }
}

export const deactivateInventoryUseCaseFactory = (
  inventoryRepository: IInventoryRepository,
): DeactivateInventoryUseCase =>
  new DeactivateInventoryUseCase(inventoryRepository);