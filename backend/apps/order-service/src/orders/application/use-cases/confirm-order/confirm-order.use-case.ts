import { Order } from '../../../../shared/domain/order.aggregate';
import { OrderNotFoundException } from '../../../../shared/domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import {
  CreateInvoiceInput,
  ICreateInvoicePort,
} from '../../ports/create-invoice.port';
import { OrderPaymentMethod } from '../../../../shared/domain/enums/order-payment-method.enum';
import { OrderPaymentStatus } from '../../../../shared/domain/enums/order-payment-status.enum';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';
import { IOrderEventPublisherPort } from 'apps/order-service/src/shared/application/ports/order-event-publisher.port';
import { pullOrderEventEnvelopes } from 'apps/order-service/src/shared/application/order-event-envelope';

export class ConfirmOrderUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly createInvoicePort: ICreateInvoicePort,
    private readonly orderEventPublisherPort: IOrderEventPublisherPort,
  ) {}

  public async execute(
    id: string,
    employeeId: string,
  ): Promise<{ id: string; status: OrderStatus }> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    await this.createInvoicePort.execute(
      this.toCreateInvoiceInput(order, employeeId),
    );

    order.markAsConfirmed();

    await this.ordersRepository.updateStatus(order);

    await this.orderEventPublisherPort.publish(pullOrderEventEnvelopes(order));

    return { id, status: order.getStatus() };
  }

  private toCreateInvoiceInput(
    order: Order,
    employeeId: string,
  ): CreateInvoiceInput {
    return {
      orderId: order.getId(),
      code: order.getCode(),
      customerId: order.getCustomerId(),
      totalAmount: order.getTotalAmount(),
      paid:
        order.getPaymentStatus() === OrderPaymentStatus.PAID &&
        order.getPaymentMethod() !== OrderPaymentMethod.CASH,
      employeeId,
    };
  }
}

export const confirmOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  createInvoicePort: ICreateInvoicePort,
  orderEventPublisherPort: IOrderEventPublisherPort,
): ConfirmOrderUseCase =>
  new ConfirmOrderUseCase(
    ordersRepository,
    createInvoicePort,
    orderEventPublisherPort,
  );
