import { InventoryReadModel } from '../find-all-inventory/read-models/inventory.read-model';
import { type IInventoryRepository } from '../../../domain/repositories/inventory.repository';

export class FindInventoryByVariantUseCase {
  public constructor(
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  public async execute(variantId: string): Promise<InventoryReadModel | null> {
    const inventory = await this.inventoryRepository.findByVariantId(variantId);

    return inventory
      ? new InventoryReadModel(
          inventory.getId(),
          inventory.getVariantId(),
          inventory.getQuantity(),
          inventory.getLastUpdatedAt(),
          inventory.getCreatedAt(),
          inventory.getUpdatedAt(),
        )
      : null;
  }
}

export const findInventoryByVariantUseCaseFactory = (
  inventoryRepository: IInventoryRepository,
): FindInventoryByVariantUseCase =>
  new FindInventoryByVariantUseCase(inventoryRepository);
