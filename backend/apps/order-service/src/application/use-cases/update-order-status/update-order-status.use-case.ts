import { Order } from '../../../domain/order.aggregate';
import { OrderTransaction } from '../../../domain/entities/order-transaction.entity';
import { InvalidOrderStatusException } from '../../../domain/exceptions/invalid-order-status.exception';
import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { ICreateInvoicePort } from '../../../domain/ports/create-invoice.port';
import { IRestoreStockPort } from '../../../domain/ports/restore-stock.port';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { IOrderTransactionsRepository } from '../../../domain/repositories/order-transactions.repository';
import { OrderPaymentStatus, OrderStatus } from '../../../domain/types';

export class UpdateOrderStatusUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly orderTransactionsRepository: IOrderTransactionsRepository,
    private readonly createInvoicePort: ICreateInvoicePort,
    private readonly restoreStockPort: IRestoreStockPort,
  ) {}

  public async execute(
    id: string,
    status: OrderStatus,
    employeeId: string,
  ): Promise<{ id: string; status: OrderStatus }> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    this.applyTransition(order, status);

    const updated = await this.ordersRepository.setStatus(
      id,
      order.getStatus(),
    );

    if (!updated) {
      throw new OrderNotFoundException(id);
    }

    if (status === OrderStatus.DELIVERED) {
      await this.recordDelivery(order, employeeId);
    }

    if (status === OrderStatus.CANCELLED || status === OrderStatus.RETURNED) {
      await this.restoreStock(order);
    }

    return { id, status: order.getStatus() };
  }

  private applyTransition(order: Order, status: OrderStatus): void {
    switch (status) {
      case OrderStatus.CONFIRMED:
        order.confirm();
        return;
      case OrderStatus.PREPARING:
        order.startPreparing();
        return;
      case OrderStatus.SHIPPING:
        order.startShipping();
        return;
      case OrderStatus.DELIVERED:
        order.deliver();
        return;
      case OrderStatus.DELIVERY_FAILED:
        order.failDelivery();
        return;
      case OrderStatus.RETURNED:
        order.returnOrder();
        return;
      case OrderStatus.REFUNDED:
        order.refund();
        return;
      case OrderStatus.CANCELLED:
        order.cancel();
        return;
      default:
        throw new InvalidOrderStatusException(
          order.getId(),
          order.getStatus(),
          status,
        );
    }
  }

  private async recordDelivery(
    order: Order,
    employeeId: string,
  ): Promise<void> {
    const transactions = order.getLines().map((line) =>
      OrderTransaction.create({
        orderId: order.getId(),
        variantId: line.getVariantId(),
        quantity: line.getQuantity(),
        unitPrice: line.getUnitPrice(),
        employeeId,
      }),
    );

    await this.orderTransactionsRepository.saveMany(transactions);

    await this.createInvoicePort.execute({
      orderId: order.getId(),
      code: order.getCode(),
      customerId: order.getCustomerId(),
      totalAmount: order.getTotalAmount(),
      paid: order.getPaymentStatus() === OrderPaymentStatus.PAID,
      employeeId,
    });
  }

  private async restoreStock(order: Order): Promise<void> {
    for (const line of order.getLines()) {
      await this.restoreStockPort.execute(
        line.getVariantId(),
        line.getQuantity(),
      );
    }
  }
}

export const updateOrderStatusUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  orderTransactionsRepository: IOrderTransactionsRepository,
  createInvoicePort: ICreateInvoicePort,
  restoreStockPort: IRestoreStockPort,
): UpdateOrderStatusUseCase =>
  new UpdateOrderStatusUseCase(
    ordersRepository,
    orderTransactionsRepository,
    createInvoicePort,
    restoreStockPort,
  );
