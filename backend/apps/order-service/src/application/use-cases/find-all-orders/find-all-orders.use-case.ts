import { OrderStatus } from '../../../domain/types';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { OrderReadModel } from './read-models/order.read-model';

export class FindAllOrdersUseCase {
  public constructor(private readonly ordersRepository: IOrdersRepository) {}

  public async execute(options?: {
    search?: string;
    status?: OrderStatus;
    customerId?: string;
  }): Promise<OrderReadModel[]> {
    const orders = await this.ordersRepository.findAll(options);
    return orders.map((order) => OrderReadModel.from(order));
  }
}

export const findAllOrdersUseCaseFactory = (
  ordersRepository: IOrdersRepository,
): FindAllOrdersUseCase => new FindAllOrdersUseCase(ordersRepository);
