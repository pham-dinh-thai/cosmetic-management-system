import { OverstockInventoryReadModel } from './read-models/overstock-inventory.read-model';
import { IInventoryRepository } from '../../../domain/repositories/inventory.repository';

const DAY_IN_MS = 86_400_000;

export class FindOverstockInventoriesUseCase {
  public constructor(
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  public async execute(
    days: number = 90,
  ): Promise<OverstockInventoryReadModel[]> {
    const inventories = await this.inventoryRepository.findOverstock(days);
    const now = new Date();

    return inventories.map((inventory) => {
      const inactiveDays = Math.floor(
        (now.getTime() - inventory.getLastUpdatedAt().getTime()) / DAY_IN_MS,
      );

      return new OverstockInventoryReadModel(
        inventory.getId(),
        inventory.getVariantId(),
        inventory.getQuantity(),
        inactiveDays,
        inventory.getLastUpdatedAt(),
      );
    });
  }
}

export const findOverstockInventoriesUseCaseFactory = (
  inventoryRepository: IInventoryRepository,
): FindOverstockInventoriesUseCase =>
  new FindOverstockInventoriesUseCase(inventoryRepository);
