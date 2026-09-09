import { InventoryReadModel } from '../find-all-inventory/read-models/inventory.read-model';
import { type IInventoryRepository } from '../../../domain/repositories/inventory.repository';

export class FindInventoryByIdUseCase {
  public constructor(
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  public async execute(id: string): Promise<InventoryReadModel | null> {
    const inventory = await this.inventoryRepository.findById(id);

    return inventory
      ? new InventoryReadModel(
          inventory.getId(),
          inventory.getVariantId(),
          inventory.getQuantity(),
          inventory.getLastUpdatedAt(),
          inventory.getCreatedAt(),
          inventory.getUpdatedAt(),
          inventory.getExpiryDate(),
          inventory.getMinStock(),
          inventory.getIsActive(),
          inventory.getCreatedBy(),
        )
      : null;
  }
}

export const findInventoryByIdUseCaseFactory = (
  inventoryRepository: IInventoryRepository,
): FindInventoryByIdUseCase => new FindInventoryByIdUseCase(inventoryRepository);