import { OrderNotFoundException } from '../../../../shared/domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { IFinalizeInvoicePort } from '../../ports/finalize-invoice.port';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';
import { IOrderEventPublisherPort } from 'apps/order-service/src/shared/application/ports/order-event-publisher.port';
import { pullOrderEventEnvelopes } from 'apps/order-service/src/shared/application/order-event-envelope';

export class CompleteOrderUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly finalizeInvoicePort: IFinalizeInvoicePort,
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

    order.markAsCompleted();

    await this.finalizeInvoicePort.execute({
      orderId: order.getId(),
      employeeId,
    });

    await this.ordersRepository.updateStatus(order);

    await this.orderEventPublisherPort.publish(pullOrderEventEnvelopes(order));

    return { id, status: order.getStatus() };
  }
}

export const completeOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  finalizeInvoicePort: IFinalizeInvoicePort,
  orderEventPublisherPort: IOrderEventPublisherPort,
): CompleteOrderUseCase =>
  new CompleteOrderUseCase(
    ordersRepository,
    finalizeInvoicePort,
    orderEventPublisherPort,
  );
