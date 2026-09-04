import { type IInventoryRepository } from '../../../domain/repositories/inventory.repository';

export class DecreaseInventoryUseCase {
  public constructor(
    private readonly inventoryRepository: IInventoryRepository,
  ) {}

  public async execute(
    variantId: string,
    quantity: number,
  ): Promise<{ variantId: string; quantity: number }> {
    const inventory = await this.inventoryRepository.removeStock(
      variantId,
      quantity,
    );

    return {
      variantId: inventory.getVariantId(),
      quantity: inventory.getQuantity(),
    };
  }
}

export const decreaseInventoryUseCaseFactory = (
  inventoryRepository: IInventoryRepository,
): DecreaseInventoryUseCase =>
  new DecreaseInventoryUseCase(inventoryRepository);
