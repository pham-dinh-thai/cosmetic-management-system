import { type ICosmeticsRepository } from '../../../../domain/repositories/cosmetics.repository';
import { type IStockReaderPort } from '../../../../infrastructure/adapters/stock-reader.adapter';
import { FindAllCosmeticReadModel } from './read-models/find-all-cosmetic.read-model';

export class FindAllCosmeticsUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
    private readonly stockReader: IStockReaderPort,
  ) {}

  public async execute(search?: string): Promise<FindAllCosmeticReadModel[]> {
    const cosmetics = await this.cosmeticsRepository.findAll(search);

    const allVariantIds = cosmetics.flatMap((c) =>
      c.getVariants()
        .filter((v) => v.getIsActive())
        .map((v) => v.getId()),
    );

    const stocks = await this.stockReader.getStocks(allVariantIds);

    return cosmetics
      .map((cosmetic) => {
        const activeVariants = cosmetic
          .getVariants()
          .filter((v) => v.getIsActive());

        const totalStock = activeVariants.reduce(
          (sum, v) => sum + (stocks[v.getId()]?.quantity ?? 0),
          0,
        );

        return new FindAllCosmeticReadModel(
          cosmetic.getId(),
          cosmetic.getCode(),
          cosmetic.getName(),
          cosmetic.getBrand(),
          cosmetic.getOrigin(),
          cosmetic.getDescription(),
          cosmetic.getImageUrl(),
          cosmetic.getVariantCount(),
          totalStock,
          cosmetic.getIsActive(),
          cosmetic.getCreatedAt(),
          cosmetic.getUpdatedAt(),
        );
      })
      .sort((a, b) => {
        if (a.totalStock > 0 && b.totalStock === 0) return -1;
        if (a.totalStock === 0 && b.totalStock > 0) return 1;
        return 0;
      });
  }
}

export const findAllCosmeticsUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
  stockReader: IStockReaderPort,
) => new FindAllCosmeticsUseCase(cosmeticsRepository, stockReader);
