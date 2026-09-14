import { InventoryNotFoundException } from '../../../domain/exceptions/inventory-not-found.exception';
import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';

export type BatchDeductionDTO = {
  batchId: string;
  quantity: number;
};

export type IReverseBatchStockRequest = {
  deductions: BatchDeductionDTO[];
};

export class ReverseBatchStockUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(
    id: string,
    request: IReverseBatchStockRequest,
  ): Promise<void> {
    const inventory = await this.inventoriesRepository.findById(id);

    if (!inventory) {
      throw new InventoryNotFoundException('id', id);
    }

    const batches = request.deductions.map((d) =>
      inventory.increaseBatch(d.batchId, d.quantity),
    );

    await this.inventoriesRepository.updateBatchQuantities(batches);
  }
}

export const reverseBatchStockUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new ReverseBatchStockUseCase(inventoriesRepository);
