import { Inventory } from '../../../domain/inventory.aggregate';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';
import { InventoryAlreadyExistsException } from '../../../domain/exceptions/inventory-already-exists.exception';
import { ICreateInventoryRequest } from './create-inventory.request';

export class CreateInventoryUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(request: ICreateInventoryRequest): Promise<void> {
    const existing = await this.inventoriesRepository.findByVariantId(
      request.variantId,
    );

    if (existing) {
      throw new InventoryAlreadyExistsException(request.variantId);
    }

    const inventory = Inventory.create({
      variantId: request.variantId,
      minStock: request.minStock,
    });

    await this.inventoriesRepository.create(inventory);
  }
}

export const createInventoryUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new CreateInventoryUseCase(inventoriesRepository);
