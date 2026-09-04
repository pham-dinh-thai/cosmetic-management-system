import { CosmeticNotFoundException } from '../../../domain/exceptions/cosmetic-not-found.exception';
import { type ICosmeticsRepository } from '../../../domain/repositories/cosmetics.repository';

export class DeleteCosmeticUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const deleted = await this.cosmeticsRepository.delete(id);

    if (!deleted) {
      throw new CosmeticNotFoundException(id);
    }
  }
}

export const deleteCosmeticUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
): DeleteCosmeticUseCase => new DeleteCosmeticUseCase(cosmeticsRepository);
