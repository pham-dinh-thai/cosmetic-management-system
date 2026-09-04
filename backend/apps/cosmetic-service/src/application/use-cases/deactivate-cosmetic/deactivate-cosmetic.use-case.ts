import { CosmeticNotFoundException } from '../../../domain/exceptions/cosmetic-not-found.exception';
import { type ICosmeticsRepository } from '../../../domain/repositories/cosmetics.repository';

export class DeactivateCosmeticUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const cosmetic = await this.cosmeticsRepository.deactivate(id);

    if (!cosmetic) {
      throw new CosmeticNotFoundException(id);
    }
  }
}

export const deactivateCosmeticUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
): DeactivateCosmeticUseCase =>
  new DeactivateCosmeticUseCase(cosmeticsRepository);
