import { InventoryReadModel } from './read-models/inventory.read-model';
import { type IInventoryRepository } from '../../../domain/repositories/inventory.repository';

export class FindAllInventoriesUseCase {
  public constructor(
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  public async execute(): Promise<InventoryReadModel[]> {
    const inventories = await this.inventoryRepository.findAll();

    return inventories.map(
      (inventory) =>
        new InventoryReadModel(
          inventory.getId(),
          inventory.getVariantId(),
          inventory.getQuantity(),
          inventory.getLastUpdatedAt(),
          inventory.getCreatedAt(),
          inventory.getUpdatedAt(),
          inventory.getExpiryDate(),
        ),
    );
  }
}

export const findAllInventoriesUseCaseFactory = (
  inventoryRepository: IInventoryRepository,
): FindAllInventoriesUseCase =>
  new FindAllInventoriesUseCase(inventoryRepository);
