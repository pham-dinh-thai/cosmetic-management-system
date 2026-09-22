import { IAddVariantRequest } from './add-variant.request';
import { CosmeticNotFoundException } from '../../../domain/exceptions/cosmetic-not-found.exception';
import { CostPriceCanNotBeHigherThanPriceException } from '../../../domain/exceptions/cost-price-can-not-be-higher-than-price.exception';
import { NegativePriceException } from '../../../domain/exceptions/negative-price.exception';
import { type ICosmeticsRepository } from '../../../domain/repositories/cosmetics.repository';

export class AddVariantUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
  ) {}

  public async execute(
    cosmeticId: string,
    request: IAddVariantRequest,
  ): Promise<{ id: string }> {
    if (request.price < 0 || request.costPrice < 0) {
      throw new NegativePriceException(request.price);
    }

    if (request.costPrice >= request.price) {
      throw new CostPriceCanNotBeHigherThanPriceException();
    }

    const cosmetic = await this.cosmeticsRepository.findById(cosmeticId);

    if (!cosmetic) {
      throw new CosmeticNotFoundException(cosmeticId);
    }

    return await this.cosmeticsRepository.addVariant(cosmeticId, {
      name: request.name,
      color: request.color ?? null,
      volume: request.volume ?? null,
      price: request.price,
      costPrice: request.costPrice,
    });
  }
}

export const addVariantUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
): AddVariantUseCase => new AddVariantUseCase(cosmeticsRepository);
