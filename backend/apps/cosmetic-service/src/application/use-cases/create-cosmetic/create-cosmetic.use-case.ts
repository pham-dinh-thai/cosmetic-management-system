import { ICreateCosmeticRequest } from './create-cosmetic.request';
import { Cosmetic } from '../../../domain/cosmetic.aggregate';
import { type ICosmeticsRepository } from '../../../domain/repositories/cosmetics.repository';
import { CosmeticCode } from '../../../domain/value-objects/cosmetic-code.value-object';

export class CreateCosmeticUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
  ) {}

  public async execute(
    request: ICreateCosmeticRequest,
  ): Promise<{ id: string }> {
    const code = CosmeticCode.generate(
      (await this.cosmeticsRepository.count()) + 1,
    );

    const cosmetic = Cosmetic.create({
      code: code.getValue(),
      name: request.name,
      brand: request.brand ?? null,
      origin: request.origin ?? null,
      description: request.description ?? null,
      imageUrl: request.imageUrl ?? null,
      variants: request.variants.map((variant) => ({
        name: variant.name,
        color: variant.color ?? null,
        volume: variant.volume ?? null,
        price: variant.price,
        costPrice: variant.costPrice ?? null,
      })),
      categoryIds: request.categoryIds,
    });

    return await this.cosmeticsRepository.create(cosmetic);
  }
}

export const createCosmeticUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
): CreateCosmeticUseCase => new CreateCosmeticUseCase(cosmeticsRepository);
