import { type IInventoryRepository } from '../../../domain/repositories/inventory.repository';

export class IncreaseInventoryUseCase {
  public constructor(
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  public async execute(
    variantId: string,
    quantity: number,
  ): Promise<{ variantId: string; quantity: number }> {
    const inventory = await this.inventoryRepository.addStock(
      variantId,
      quantity,
    );

    return {
      variantId: inventory.getVariantId(),
      quantity: inventory.getQuantity(),
    };
  }
}

export const increaseInventoryUseCaseFactory = (
  inventoryRepository: IInventoryRepository,
): IncreaseInventoryUseCase =>
  new IncreaseInventoryUseCase(inventoryRepository);
