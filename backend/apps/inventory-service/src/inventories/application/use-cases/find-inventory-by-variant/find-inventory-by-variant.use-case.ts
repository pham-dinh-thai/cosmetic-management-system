import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';
import { InventoryReadModel } from '../find-all-inventory/read-models/inventory.read-model';

export class FindInventoryByVariantUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(variantId: string): Promise<InventoryReadModel> {
    const inventory = await this.inventoriesRepository.findByVariantId(
      variantId,
    );

    if (!inventory) {
      throw new InventoryNotFoundException('variantId', variantId);
    }

    return InventoryReadModel.toReadModel(inventory);
  }
}

export const findInventoryByVariantUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new FindInventoryByVariantUseCase(inventoriesRepository);