import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';

export class CancelOrderUseCase {
  public constructor(private readonly ordersRepository: IOrdersRepository) {}

  public async execute(id: string): Promise<{ id: string }> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    order.cancel();

    const cancelled = await this.ordersRepository.setStatus(
      id,
      order.getStatus(),
    );

    if (!cancelled) {
      throw new OrderNotFoundException(id);
    }

    return { id };
  }
}

export const cancelOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
): CancelOrderUseCase => new CancelOrderUseCase(ordersRepository);
