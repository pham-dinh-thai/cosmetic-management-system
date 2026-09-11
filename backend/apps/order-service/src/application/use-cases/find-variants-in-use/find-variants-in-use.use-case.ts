import { type IOrdersRepository } from '../../../domain/repositories/orders.repository';

export class FindVariantsInUseUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
  ) {}

  public async execute(variantIds: string[]): Promise<string[]> {
    return await this.ordersRepository.findVariantIdsWithOrders(variantIds);
  }
}

export const findVariantsInUseUseCaseFactory = (
  ordersRepository: IOrdersRepository,
): FindVariantsInUseUseCase =>
  new FindVariantsInUseUseCase(ordersRepository);
