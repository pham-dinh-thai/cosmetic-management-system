import { IInventoriesRepository } from '../../../domain/repositories/inventories.repository';
import { InventoryReadModel } from './read-models/inventory.read-model';

export class FindAllInventoriesUseCase {
  public constructor(
    private readonly inventoriesRepository: IInventoriesRepository,
  ) {}

  public async execute(): Promise<InventoryReadModel[]> {
    const inventories = await this.inventoriesRepository.findAll();

    return inventories.map((inventory) =>
      InventoryReadModel.toReadModel(inventory),
    );
  }
}

export const findAllInventoriesUseCaseFactory = (
  inventoriesRepository: IInventoriesRepository,
) => new FindAllInventoriesUseCase(inventoriesRepository);