import { type ICosmeticsRepository } from '../../../../domain/repositories/cosmetics.repository';

export class VariantLabelReadData {
  public constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly cosmeticName: string,
  ) {}
}

export class FindVariantsByIdsUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
  ) {}

  public async execute(ids: string[]): Promise<VariantLabelReadData[]> {
    const variants = await this.cosmeticsRepository.findVariantsByIds(ids);

    return variants.map(
      (variant) =>
        new VariantLabelReadData(
          variant.id,
          variant.name,
          variant.cosmeticName,
        ),
    );
  }
}

export const findVariantsByIdsUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
): FindVariantsByIdsUseCase =>
  new FindVariantsByIdsUseCase(cosmeticsRepository);