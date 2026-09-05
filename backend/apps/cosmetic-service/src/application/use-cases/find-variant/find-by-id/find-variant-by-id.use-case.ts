import { type ICosmeticsRepository } from '../../../../domain/repositories/cosmetics.repository';

export class VariantReadData {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
  ) {}
}

export class FindVariantByIdUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
  ) {}

  public async execute(variantId: string): Promise<VariantReadData | null> {
    const variant = await this.cosmeticsRepository.findVariantById(variantId);

    if (!variant) {
      return null;
    }

    return new VariantReadData(variant.id, variant.name, variant.price);
  }
}

export const findVariantByIdUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
): FindVariantByIdUseCase => new FindVariantByIdUseCase(cosmeticsRepository);
