import { OrderNotFoundException } from '../../../../shared/domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';
import { IOrderEventPublisherPort } from 'apps/order-service/src/shared/application/ports/order-event-publisher.port';
import { pullOrderEventEnvelopes } from 'apps/order-service/src/shared/application/order-event-envelope';

export class DeliveryFailedOrderUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly orderEventPublisherPort: IOrderEventPublisherPort,
  ) {}

  public async execute(
    id: string,
  ): Promise<{ id: string; status: OrderStatus }> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    order.markAsDeliveryFailed();

    await this.ordersRepository.updateStatus(order);

    await this.orderEventPublisherPort.publish(pullOrderEventEnvelopes(order));

    return { id, status: order.getStatus() };
  }
}

export const deliveryFailedOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  orderEventPublisherPort: IOrderEventPublisherPort,
): DeliveryFailedOrderUseCase =>
  new DeliveryFailedOrderUseCase(ordersRepository, orderEventPublisherPort);
