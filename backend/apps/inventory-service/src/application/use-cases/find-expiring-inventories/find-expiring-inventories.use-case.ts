import { ExpiringInventoryReadModel } from './read-models/expiring-inventory.read-model';
import { IInventoryRepository } from '../../../domain/repositories/inventory.repository';

const DAY_IN_MS = 86_400_000;

export class FindExpiringInventoriesUseCase {
  public constructor(
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  public async execute(
    days: number = 30,
  ): Promise<ExpiringInventoryReadModel[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inventories = await this.inventoryRepository.findExpiring(days);

    return inventories
      .filter((inventory) => inventory.getExpiryDate() !== undefined)
      .map((inventory) => {
        const expiryDate = inventory.getExpiryDate() as Date;

        return new ExpiringInventoryReadModel(
          inventory.getId(),
          inventory.getVariantId(),
          inventory.getQuantity(),
          expiryDate,
          Math.ceil((expiryDate.getTime() - today.getTime()) / DAY_IN_MS),
          inventory.getLastUpdatedAt(),
        );
      });
  }
}

export const findExpiringInventoriesUseCaseFactory = (
  inventoryRepository: IInventoryRepository,
): FindExpiringInventoriesUseCase =>
  new FindExpiringInventoriesUseCase(inventoryRepository);
