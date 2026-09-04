import { CosmeticVariantNotFoundException } from '../../../domain/exceptions/cosmetic-variant-not-found.exception';
import { type ICosmeticsRepository } from '../../../domain/repositories/cosmetics.repository';

export class DeactivateVariantUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
  ) {}

  public async execute(variantId: string): Promise<void> {
    const variant = await this.cosmeticsRepository.deactivateVariant(variantId);

    if (!variant) {
      throw new CosmeticVariantNotFoundException(variantId);
    }
  }
}

export const deactivateVariantUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
): DeactivateVariantUseCase =>
  new DeactivateVariantUseCase(cosmeticsRepository);
