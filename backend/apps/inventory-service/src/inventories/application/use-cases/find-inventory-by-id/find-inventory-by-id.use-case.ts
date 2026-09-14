import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';
import { InventoryReadModel } from '../find-all-inventory/read-models/inventory.read-model';

export class FindInventoryByIdUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(id: string): Promise<InventoryReadModel> {
    const inventory = await this.inventoriesRepository.findById(id);

    if (!inventory) {
      throw new InventoryNotFoundException('id', id);
    }

    return InventoryReadModel.toReadModel(inventory);
  }
}

export const findInventoryByIdUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new FindInventoryByIdUseCase(inventoriesRepository);