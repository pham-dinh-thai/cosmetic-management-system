import { Order } from '../../../../orders/domain/order.aggregate';
import { IMyOrdersRepository } from '../../../domain/repositories/my-orders.repository';
import { IRestoreStockPort } from '../../ports/restore-stock.port';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';
import { ViewMyOrderUseCase } from '../view-my-order/view-my-order.use-case';

export class CancelMyOrderUseCase {
  public constructor(
    private readonly ordersRepository: IMyOrdersRepository,
    private readonly restoreStockPort: IRestoreStockPort,
    private readonly viewMyOrderUseCase: ViewMyOrderUseCase,
  ) {}

  public async execute(
    id: string,
    customerId: string,
  ): Promise<{ id: string; status: OrderStatus }> {
    const order = await this.viewMyOrderUseCase.assertMine(id, customerId);

    await this.restoreStock(order);

    order.markAsCancelled();

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

export const cancelMyOrderUseCaseFactory = (
  ordersRepository: IMyOrdersRepository,
  restoreStockPort: IRestoreStockPort,
  viewMyOrderUseCase: ViewMyOrderUseCase,
): CancelMyOrderUseCase =>
  new CancelMyOrderUseCase(
    ordersRepository,
    restoreStockPort,
    viewMyOrderUseCase,
  );
