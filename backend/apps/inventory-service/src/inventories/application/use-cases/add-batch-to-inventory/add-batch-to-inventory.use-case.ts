import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';
import { IAddBatchToInventoryRequest } from './add-batch-to-inventory.request';

export class AddBatchToInventoryUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(
    id: string,
    request: IAddBatchToInventoryRequest,
    createdBy: string,
  ): Promise<void> {
    const inventory = await this.inventoriesRepository.findById(id);

    if (!inventory) {
      throw new InventoryNotFoundException('id', id);
    }

    const batch = inventory.addBatch({
      lotNumber: inventory.createNextLotNumber(),
      supplierId: request.supplierId,
      quantity: request.quantity,
      expiredDate: request.expiredDate,
      createdBy,
    });

    await this.inventoriesRepository.addBatch(inventory.getId(), batch);
  }
}

export const addBatchToInventoryUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new AddBatchToInventoryUseCase(inventoriesRepository);
