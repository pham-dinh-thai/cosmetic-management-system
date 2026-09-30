import { Order } from '../../../../shared/domain/order.aggregate';
import { OrderNotFoundException } from '../../../../shared/domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { IRestoreStockPort } from '../../ports/restore-stock.port';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';
import { IOrderEventPublisherPort } from 'apps/order-service/src/shared/application/ports/order-event-publisher.port';
import { pullOrderEventEnvelopes } from 'apps/order-service/src/shared/application/order-event-envelope';

export class ReturnOrderUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly restoreStockPort: IRestoreStockPort,
    private readonly orderEventPublisherPort: IOrderEventPublisherPort,
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

    await this.orderEventPublisherPort.publish(pullOrderEventEnvelopes(order));

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
  orderEventPublisherPort: IOrderEventPublisherPort,
): ReturnOrderUseCase =>
  new ReturnOrderUseCase(
    ordersRepository,
    restoreStockPort,
    orderEventPublisherPort,
  );
