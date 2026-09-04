import { IUpdateVariantRequest } from './update-variant.request';
import { CosmeticVariantNotFoundException } from '../../../domain/exceptions/cosmetic-variant-not-found.exception';
import { NegativePriceException } from '../../../domain/exceptions/negative-price.exception';
import { type ICosmeticsRepository } from '../../../domain/repositories/cosmetics.repository';

export class UpdateVariantUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
  ) {}

  public async execute(
    variantId: string,
    request: IUpdateVariantRequest,
  ): Promise<void> {
    if (
      request.price < 0 ||
      (request.costPrice !== undefined && request.costPrice < 0)
    ) {
      throw new NegativePriceException(request.price);
    }

    const updated = await this.cosmeticsRepository.updateVariant(variantId, {
      name: request.name,
      color: request.color ?? null,
      volume: request.volume ?? null,
      price: request.price,
      costPrice: request.costPrice ?? null,
    });

    if (!updated) {
      throw new CosmeticVariantNotFoundException(variantId);
    }
  }
}

export const updateVariantUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
): UpdateVariantUseCase => new UpdateVariantUseCase(cosmeticsRepository);
