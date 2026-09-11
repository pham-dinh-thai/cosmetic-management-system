import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { type IInventoryRepository } from '../../../domain/repositories/inventory.repository';

export class DeleteInventoryUseCase {
  public constructor(
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const deleted = await this.inventoryRepository.delete(id);

    if (!deleted) {
      throw new InventoryNotFoundException(id);
    }
  }
}

export const deleteInventoryUseCaseFactory = (
  inventoryRepository: IInventoryRepository,
): DeleteInventoryUseCase => new DeleteInventoryUseCase(inventoryRepository);
