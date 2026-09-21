import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import {
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderStatus,
} from '../../../domain/types';

export class UpdateOrderPaymentStatusUseCase {
  public constructor(private readonly ordersRepository: IOrdersRepository) {}

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
      order.isPendingConfirmation() &&
      order.getPaymentMethod() !== OrderPaymentMethod.CASH
    ) {
      order.confirm();
    }

    await this.ordersRepository.setPaymentStatus(id, order.getPaymentStatus());

    if (order.getStatus() !== previousStatus) {
      await this.ordersRepository.setStatus(id, order.getStatus());
    }

    return {
      id,
      status: order.getStatus(),
      paymentStatus: order.getPaymentStatus(),
    };
  }
}

export const updateOrderPaymentStatusUseCaseFactory = (
  ordersRepository: IOrdersRepository,
): UpdateOrderPaymentStatusUseCase =>
  new UpdateOrderPaymentStatusUseCase(ordersRepository);
