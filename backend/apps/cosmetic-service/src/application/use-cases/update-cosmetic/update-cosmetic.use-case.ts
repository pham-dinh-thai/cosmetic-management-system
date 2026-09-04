import { IUpdateCosmeticRequest } from './update-cosmetic.request';
import { CosmeticNotFoundException } from '../../../domain/exceptions/cosmetic-not-found.exception';
import { type ICosmeticsRepository } from '../../../domain/repositories/cosmetics.repository';

export class UpdateCosmeticUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
  ) {}

  public async execute(
    id: string,
    request: IUpdateCosmeticRequest,
  ): Promise<void> {
    const updated = await this.cosmeticsRepository.update(id, {
      name: request.name,
      brand: request.brand ?? null,
      origin: request.origin ?? null,
      description: request.description ?? null,
      imageUrl: request.imageUrl ?? null,
    });

    if (!updated) {
      throw new CosmeticNotFoundException(id);
    }
  }
}

export const updateCosmeticUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
): UpdateCosmeticUseCase => new UpdateCosmeticUseCase(cosmeticsRepository);
