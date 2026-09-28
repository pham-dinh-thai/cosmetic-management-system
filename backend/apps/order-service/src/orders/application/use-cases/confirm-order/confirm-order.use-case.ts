import { Order } from '../../../domain/order.aggregate';
import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import {
  CreateInvoiceInput,
  ICreateInvoicePort,
} from '../../ports/create-invoice.port';
import { OrderPaymentMethod } from '../../../../shared/domain/enums/order-payment-method.enum';
import { OrderPaymentStatus } from '../../../../shared/domain/enums/order-payment-status.enum';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';

export class ConfirmOrderUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly createInvoicePort: ICreateInvoicePort,
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

    order.pullDomainEvents();

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
): ConfirmOrderUseCase =>
  new ConfirmOrderUseCase(ordersRepository, createInvoicePort);
