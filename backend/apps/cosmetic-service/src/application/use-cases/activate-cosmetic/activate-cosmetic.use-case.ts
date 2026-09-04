import { CosmeticNotFoundException } from '../../../domain/exceptions/cosmetic-not-found.exception';
import { type ICosmeticsRepository } from '../../../domain/repositories/cosmetics.repository';

export class ActivateCosmeticUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const cosmetic = await this.cosmeticsRepository.activate(id);

    if (!cosmetic) {
      throw new CosmeticNotFoundException(id);
    }
  }
}

export const activateCosmeticUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
): ActivateCosmeticUseCase => new ActivateCosmeticUseCase(cosmeticsRepository);
