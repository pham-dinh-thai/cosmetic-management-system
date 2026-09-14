import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';
import { BatchReadModel } from '../find-batches/read-models/batch.read-model';

const DAY_IN_MS = 86_400_000;

export class FindExpiringBatchesUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(days: number = 30): Promise<BatchReadModel[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cutoff = new Date(today.getTime() + days * DAY_IN_MS);

    const inventories = await this.inventoriesRepository.findAll();

    const expiring: BatchReadModel[] = [];

    for (const inventory of inventories) {
      for (const batch of inventory.getBatches()) {
        if (
          !batch.getIsActive() ||
          batch.getQuantity() <= 0 ||
          batch.getExpiredDate().getTime() < today.getTime() ||
          batch.getExpiredDate().getTime() > cutoff.getTime()
        ) {
          continue;
        }

        expiring.push(
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

    return expiring.sort(
      (a, b) => a.expiredDate.getTime() - b.expiredDate.getTime(),
    );
  }
}

export const findExpiringBatchesUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new FindExpiringBatchesUseCase(inventoriesRepository);