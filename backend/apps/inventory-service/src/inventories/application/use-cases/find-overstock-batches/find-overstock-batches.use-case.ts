import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';
import { BatchReadModel } from '../find-batches/read-models/batch.read-model';

const DAY_IN_MS = 86_400_000;

export class FindOverstockBatchesUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(days: number = 90): Promise<BatchReadModel[]> {
    const now = new Date();

    const cutoff = new Date(now.getTime() - days * DAY_IN_MS);

    const inventories = await this.inventoriesRepository.findAll();

    const overstock: BatchReadModel[] = [];

    for (const inventory of inventories) {
      for (const batch of inventory.getBatches()) {
        if (
          !batch.getIsActive() ||
          batch.getQuantity() <= 0 ||
          batch.getUpdatedAt().getTime() >= cutoff.getTime()
        ) {
          continue;
        }

        overstock.push(
          new BatchReadModel(
            batch.getId(),
            inventory.getId(),
            inventory.getVariantId(),
            batch.getLotNumber(),
            batch.getSupplierId(),
            batch.getQuantity(),
            batch.getExpiredDate(),
            batch.getUpdatedAt(),
          ),
        );
      }
    }

    return overstock.sort(
      (a, b) => a.updatedAt.getTime() - b.updatedAt.getTime(),
    );
  }
}

export const findOverstockBatchesUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new FindOverstockBatchesUseCase(inventoriesRepository);