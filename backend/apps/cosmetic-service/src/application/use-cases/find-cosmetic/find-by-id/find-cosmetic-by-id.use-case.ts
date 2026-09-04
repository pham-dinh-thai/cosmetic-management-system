import { type ICosmeticsRepository } from '../../../../domain/repositories/cosmetics.repository';
import { FindCosmeticByIdReadModel } from './read-models/find-cosmetic-by-id.read-model';

export class FindCosmeticByIdUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
  ) {}

  public async execute(id: string): Promise<FindCosmeticByIdReadModel | null> {
    const cosmetic = await this.cosmeticsRepository.findById(id);

    return cosmetic
      ? new FindCosmeticByIdReadModel(
          cosmetic.getId(),
          cosmetic.getCode(),
          cosmetic.getName(),
          cosmetic.getBrand(),
          cosmetic.getOrigin(),
          cosmetic.getDescription(),
          cosmetic.getImageUrl(),
          cosmetic
            .getVariants()
            .filter((variant) => variant.getIsActive())
            .map((variant) => ({
              id: variant.getId(),
              name: variant.getName(),
              color: variant.getColor(),
              volume: variant.getVolume(),
              price: variant.getPrice(),
              costPrice: variant.getCostPrice(),
              isActive: variant.getIsActive(),
            })),
          cosmetic.getCategoryIds(),
          cosmetic.getIsActive(),
          cosmetic.getCreatedAt(),
          cosmetic.getUpdatedAt(),
        )
      : null;
  }
}

export const findCosmeticByIdUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
): FindCosmeticByIdUseCase => new FindCosmeticByIdUseCase(cosmeticsRepository);
