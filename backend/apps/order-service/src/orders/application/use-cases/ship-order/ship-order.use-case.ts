import { Order } from '../../../domain/order.aggregate';
import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { IOrderTransactionsRepository } from '../../ports/order-transactions.repository';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';

export class ShipOrderUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly orderTransactionsRepository: IOrderTransactionsRepository,
  ) {}

  public async execute(
    id: string,
    employeeId: string,
  ): Promise<{ id: string; status: OrderStatus }> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    await this.recordStockOut(order, employeeId);

    order.markAsShipping();

    await this.ordersRepository.updateStatus(order);

    order.pullDomainEvents();

    return { id, status: order.getStatus() };
  }

  private async recordStockOut(
    order: Order,
    employeeId: string,
  ): Promise<void> {
    const transactions = order.getLines().map((line) => ({
      orderId: order.getId(),
      variantId: line.getVariantId(),
      quantity: line.getQuantity(),
      unitPrice: line.getUnitPrice(),
      employeeId,
    }));

    await this.orderTransactionsRepository.saveMany(transactions);
  }
}

export const shipOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  orderTransactionsRepository: IOrderTransactionsRepository,
): ShipOrderUseCase =>
  new ShipOrderUseCase(ordersRepository, orderTransactionsRepository);
