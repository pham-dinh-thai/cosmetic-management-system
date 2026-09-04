import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { InvalidOrderStatusException } from '../../../domain/exceptions/invalid-order-status.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { OrderStatus } from '../../../domain/types';

export class DeleteOrderUseCase {
  public constructor(private readonly ordersRepository: IOrdersRepository) {}

  public async execute(id: string): Promise<{ id: string }> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    if (order.getStatus() !== OrderStatus.PENDING) {
      throw new InvalidOrderStatusException(id, order.getStatus(), 'DELETED');
    }

    const deleted = await this.ordersRepository.delete(id);

    if (!deleted) {
      throw new OrderNotFoundException(id);
    }

    return { id };
  }
}

export const deleteOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
): DeleteOrderUseCase => new DeleteOrderUseCase(ordersRepository);
