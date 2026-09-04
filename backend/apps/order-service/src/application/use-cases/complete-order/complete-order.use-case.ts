import { OrderTransaction } from '../../../domain/entities/order-transaction.entity';
import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { IPublishOrderCompletedPort } from '../../../domain/ports/publish-order-completed.port';
import { IRemoveStockPort } from '../../../domain/ports/remove-stock.port';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { IOrderTransactionsRepository } from '../../../domain/repositories/order-transactions.repository';

export class CompleteOrderUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly removeStockPort: IRemoveStockPort,
    private readonly orderTransactionsRepository: IOrderTransactionsRepository,
    private readonly publishOrderCompletedPort: IPublishOrderCompletedPort,
  ) {}

  public async execute(
    id: string,
    employeeId: string,
  ): Promise<{ id: string }> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    for (const line of order.getLines()) {
      await this.removeStockPort.execute(
        line.getVariantId(),
        line.getQuantity(),
      );
    }

    order.complete();

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

    await this.publishOrderCompletedPort.execute({
      event: 'order.completed',
      orderId: order.getId(),
      code: order.getCode(),
      customerId: order.getCustomerId(),
      totalAmount: order.getTotalAmount(),
      occurredAt: new Date().toISOString(),
    });

    return { id };
  }
}

export const completeOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  removeStockPort: IRemoveStockPort,
  orderTransactionsRepository: IOrderTransactionsRepository,
  publishOrderCompletedPort: IPublishOrderCompletedPort,
): CompleteOrderUseCase =>
  new CompleteOrderUseCase(
    ordersRepository,
    removeStockPort,
    orderTransactionsRepository,
    publishOrderCompletedPort,
  );
