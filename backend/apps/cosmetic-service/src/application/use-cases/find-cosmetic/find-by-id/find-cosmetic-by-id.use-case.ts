import { type ICosmeticsRepository } from '../../../../domain/repositories/cosmetics.repository';
import { FindCosmeticByIdReadModel } from './read-models/find-cosmetic-by-id.read-model';
import { type IStockReaderPort } from '../../../../infrastructure/adapters/stock-reader.adapter';

export class FindCosmeticByIdUseCase {
  public constructor(
    private readonly cosmeticsRepository: ICosmeticsRepository,
    private readonly stockReader: IStockReaderPort,
  ) {}

  public async execute(id: string): Promise<FindCosmeticByIdReadModel | null> {
    const cosmetic = await this.cosmeticsRepository.findById(id);

    if (!cosmetic) {
      return null;
    }

    const variants = cosmetic
      .getVariants()
      .filter((variant) => variant.getIsActive());

    const stocks = await this.stockReader.getStocks(
      variants.map((variant) => variant.getId()),
    );

    return new FindCosmeticByIdReadModel(
      cosmetic.getId(),
      cosmetic.getCode(),
      cosmetic.getName(),
      cosmetic.getBrand(),
      cosmetic.getOrigin(),
      cosmetic.getDescription(),
      cosmetic.getImageUrl(),
      variants.map((variant) => {
        const stock = stocks[variant.getId()];
        return {
          id: variant.getId(),
          name: variant.getName(),
          color: variant.getColor(),
          volume: variant.getVolume(),
          price: variant.getPrice(),
          costPrice: variant.getCostPrice(),
          isActive: variant.getIsActive(),
          quantity: stock?.quantity ?? 0,
          minStock: stock?.minStock ?? 0,
        };
      }),
      cosmetic.getCategoryIds(),
      cosmetic.getIsActive(),
      cosmetic.getCreatedAt(),
      cosmetic.getUpdatedAt(),
    );
  }
}

export const findCosmeticByIdUseCaseFactory = (
  cosmeticsRepository: ICosmeticsRepository,
  stockReader: IStockReaderPort,
): FindCosmeticByIdUseCase => new FindCosmeticByIdUseCase(cosmeticsRepository, stockReader);
