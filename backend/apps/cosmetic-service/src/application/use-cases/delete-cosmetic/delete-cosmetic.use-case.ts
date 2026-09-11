import { CosmeticNotFoundException } from '../../../domain/exceptions/cosmetic-not-found.exception';
import { type ICosmeticsRepository } from '../../../domain/repositories/cosmetics.repository';
import { type IOrdersReaderPort } from '../../../infrastructure/adapters/orders-reader.adapter';
import { CosmeticHasOrdersException } from '../../../domain/exceptions/cosmetic-has-orders.exception';

export class DeleteCosmeticUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
    private readonly ordersReader: IOrdersReaderPort,
  ) {}

  public async execute(id: string): Promise<void> {
    const cosmetic = await this.cosmeticsRepository.findById(id);

    if (!cosmetic) {
      throw new CosmeticNotFoundException(id);
    }

    const variantIds = cosmetic.getVariants().map((variant) => variant.getId());

    const inUse = await this.ordersReader.findVariantIdsWithOrders(variantIds);

    if (inUse.length > 0) {
      throw new CosmeticHasOrdersException(cosmetic.getName());
    }

    await this.cosmeticsRepository.delete(id);
  }
}

export const deleteCosmeticUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
  ordersReader: IOrdersReaderPort,
): DeleteCosmeticUseCase =>
  new DeleteCosmeticUseCase(cosmeticsRepository, ordersReader);
