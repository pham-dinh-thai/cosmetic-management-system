import { type IOrdersRepository } from '../../../domain/repositories/orders.repository';

export type BestSellerReadModel = {
  variantId: string;
  quantitySold: number;
};

export class FindBestSellersUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
  ) {}

  public async execute(limit: number): Promise<BestSellerReadModel[]> {
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 4;

    return await this.ordersRepository.findBestSellers(safeLimit);
  }
}

export const findBestSellersUseCaseFactory = (
  ordersRepository: IOrdersRepository,
): FindBestSellersUseCase => new FindBestSellersUseCase(ordersRepository);