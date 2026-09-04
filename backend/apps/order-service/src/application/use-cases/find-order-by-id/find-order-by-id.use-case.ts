import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { OrderDetailReadModel } from './read-models/order-detail.read-model';

export class FindOrderByIdUseCase {
  public constructor(private readonly ordersRepository: IOrdersRepository) {}

  public async execute(id: string): Promise<OrderDetailReadModel> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    return OrderDetailReadModel.from(order);
  }
}

export const findOrderByIdUseCaseFactory = (
  ordersRepository: IOrdersRepository,
): FindOrderByIdUseCase => new FindOrderByIdUseCase(ordersRepository);
