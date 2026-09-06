import { IUpdateCosmeticImageRequest } from './update-cosmetic-image.request';
import { CosmeticNotFoundException } from '../../../domain/exceptions/cosmetic-not-found.exception';
import { type ICosmeticsRepository } from '../../../domain/repositories/cosmetics.repository';

export class UpdateCosmeticImageUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
  ) {}

  public async execute(
    id: string,
    request: IUpdateCosmeticImageRequest,
  ): Promise<void> {
    const updated = await this.cosmeticsRepository.updateImage(
      id,
      request.imageUrl,
    );

    if (!updated) {
      throw new CosmeticNotFoundException(id);
    }
  }
}

export const updateCosmeticImageUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
): UpdateCosmeticImageUseCase =>
  new UpdateCosmeticImageUseCase(cosmeticsRepository);
