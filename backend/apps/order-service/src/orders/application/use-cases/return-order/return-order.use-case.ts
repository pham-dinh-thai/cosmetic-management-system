import { Order } from '../../../domain/order.aggregate';
import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { IRestoreStockPort } from '../../ports/restore-stock.port';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';

export class ReturnOrderUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly restoreStockPort: IRestoreStockPort,
  ) {}

  public async execute(
    id: string,
  ): Promise<{ id: string; status: OrderStatus }> {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new OrderNotFoundException(id);
    }

    await this.restoreStock(order);

    order.markAsReturned();

    await this.ordersRepository.updateStatus(order);

    order.pullDomainEvents();

    return { id, status: order.getStatus() };
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

export const returnOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  restoreStockPort: IRestoreStockPort,
): ReturnOrderUseCase =>
  new ReturnOrderUseCase(ordersRepository, restoreStockPort);
