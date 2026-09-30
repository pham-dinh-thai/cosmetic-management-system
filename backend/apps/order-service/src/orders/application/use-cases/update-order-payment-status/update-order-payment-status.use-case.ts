import { OrderNotFoundException } from '../../../../shared/domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { OrderPaymentMethod } from '../../../../shared/domain/enums/order-payment-method.enum';
import { OrderPaymentStatus } from '../../../../shared/domain/enums/order-payment-status.enum';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';
import { IOrderEventPublisherPort } from 'apps/order-service/src/shared/application/ports/order-event-publisher.port';
import { pullOrderEventEnvelopes } from 'apps/order-service/src/shared/application/order-event-envelope';

export class UpdateOrderPaymentStatusUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly orderEventPublisherPort: IOrderEventPublisherPort,
  ) {}

  public async execute(
    id: string,
    paymentStatus: OrderPaymentStatus,
  ): Promise<{
    id: string;
    status: OrderStatus;
    paymentStatus: OrderPaymentStatus;
  }> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    const previousStatus = order.getStatus();

    if (paymentStatus === OrderPaymentStatus.PAID) {
      order.markPaid();
    } else {
      order.markUnpaid();
    }

    if (
      paymentStatus === OrderPaymentStatus.PAID &&
      order.isPending() &&
      order.getPaymentMethod() !== OrderPaymentMethod.CASH
    ) {
      order.markAsConfirmed();
    }

    await this.ordersRepository.setPaymentStatus(id, order.getPaymentStatus());

    if (order.getStatus() !== previousStatus) {
      await this.ordersRepository.setStatus(id, order.getStatus());
    }

    await this.orderEventPublisherPort.publish(pullOrderEventEnvelopes(order));

    return {
      id,
      status: order.getStatus(),
      paymentStatus: order.getPaymentStatus(),
    };
  }
}

export const updateOrderPaymentStatusUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  orderEventPublisherPort: IOrderEventPublisherPort,
): UpdateOrderPaymentStatusUseCase =>
  new UpdateOrderPaymentStatusUseCase(
    ordersRepository,
    orderEventPublisherPort,
  );
