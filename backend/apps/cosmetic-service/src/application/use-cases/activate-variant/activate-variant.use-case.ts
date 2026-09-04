import { CosmeticVariantNotFoundException } from '../../../domain/exceptions/cosmetic-variant-not-found.exception';
import { type ICosmeticsRepository } from '../../../domain/repositories/cosmetics.repository';

export class ActivateVariantUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
  ) {}

  public async execute(variantId: string): Promise<void> {
    const variant = await this.cosmeticsRepository.activateVariant(variantId);

    if (!variant) {
      throw new CosmeticVariantNotFoundException(variantId);
    }
  }
}

export const activateVariantUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
): ActivateVariantUseCase => new ActivateVariantUseCase(cosmeticsRepository);
