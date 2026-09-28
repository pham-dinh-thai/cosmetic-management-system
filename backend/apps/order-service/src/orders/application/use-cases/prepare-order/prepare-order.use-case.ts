import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';

export class PrepareOrderUseCase {
  public constructor(private readonly ordersRepository: IOrdersRepository) {}

  public async execute(
    id: string,
  ): Promise<{ id: string; status: OrderStatus }> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    order.markAsPreparing();

    await this.ordersRepository.updateStatus(order);

    order.pullDomainEvents();

    return { id, status: order.getStatus() };
  }
}

export const prepareOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
): PrepareOrderUseCase => new PrepareOrderUseCase(ordersRepository);
