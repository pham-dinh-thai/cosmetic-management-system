import { OrderTransaction } from '../../../domain/entities/order-transaction.entity';
import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { ICreateInvoicePort } from '../../../domain/ports/create-invoice.port';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { IOrderTransactionsRepository } from '../../../domain/repositories/order-transactions.repository';

export class CompleteOrderUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly orderTransactionsRepository: IOrderTransactionsRepository,
    private readonly createInvoicePort: ICreateInvoicePort,
  ) {}

  public async execute(
    id: string,
    employeeId: string,
  ): Promise<{ id: string }> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    order.deliver();

    const completed = await this.ordersRepository.setStatus(
      id,
      order.getStatus(),
    );

    if (!completed) {
      throw new OrderNotFoundException(id);
    }

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
      paid: false,
      employeeId,
    });

    return { id };
  }
}

export const completeOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  orderTransactionsRepository: IOrderTransactionsRepository,
  createInvoicePort: ICreateInvoicePort,
): CompleteOrderUseCase =>
  new CompleteOrderUseCase(
    ordersRepository,
    orderTransactionsRepository,
    createInvoicePort,
  );
