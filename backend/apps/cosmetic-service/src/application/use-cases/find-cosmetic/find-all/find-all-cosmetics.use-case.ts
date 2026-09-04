import { type ICosmeticsRepository } from '../../../../domain/repositories/cosmetics.repository';
import { FindAllCosmeticReadModel } from './read-models/find-all-cosmetic.read-model';

export class FindAllCosmeticsUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
  ) {}

  public async execute(search?: string): Promise<FindAllCosmeticReadModel[]> {
    const cosmetics = await this.cosmeticsRepository.findAll(search);

    return cosmetics.map(
      (cosmetic) =>
        new FindAllCosmeticReadModel(
          cosmetic.getId(),
          cosmetic.getCode(),
          cosmetic.getName(),
          cosmetic.getBrand(),
          cosmetic.getOrigin(),
          cosmetic.getDescription(),
          cosmetic.getImageUrl(),
          cosmetic.getVariantCount(),
          cosmetic.getIsActive(),
          cosmetic.getCreatedAt(),
          cosmetic.getUpdatedAt(),
        ),
    );
  }
}

export const findAllCosmeticsUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
): FindAllCosmeticsUseCase => new FindAllCosmeticsUseCase(cosmeticsRepository);
