import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { type IInventoryRepository } from '../../../domain/repositories/inventory.repository';

export class AdjustInventoryUseCase {
  public constructor(
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  public async execute(
    id: string,
    adjustment: number,
  ): Promise<{ id: string; quantity: number }> {
    const inventory = await this.inventoryRepository.adjust(id, adjustment);

    if (!inventory) {
      throw new InventoryNotFoundException(id);
    }

    return { id: inventory.getId(), quantity: inventory.getQuantity() };
  }
}

export const adjustInventoryUseCaseFactory = (
  inventoryRepository: IInventoryRepository,
): AdjustInventoryUseCase => new AdjustInventoryUseCase(inventoryRepository);
