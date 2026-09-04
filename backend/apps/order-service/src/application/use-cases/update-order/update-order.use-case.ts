import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { IUpdateOrderRequest } from './update-order.request';

export class UpdateOrderUseCase {
  public constructor(private readonly ordersRepository: IOrdersRepository) {}

  public async execute(
    id: string,
    request: IUpdateOrderRequest,
  ): Promise<{ id: string }> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    order.replaceLines(request.lines);

    const updated = await this.ordersRepository.replaceLines(id, request.lines);

    if (!updated) {
      throw new OrderNotFoundException(id);
    }

    return { id };
  }
}

export const updateOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
): UpdateOrderUseCase => new UpdateOrderUseCase(ordersRepository);
