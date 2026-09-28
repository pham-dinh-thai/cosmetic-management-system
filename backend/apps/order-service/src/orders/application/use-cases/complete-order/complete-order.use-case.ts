import { OrderNotFoundException } from '../../../domain/exceptions/order-not-found.exception';
import { IOrdersRepository } from '../../../domain/repositories/orders.repository';
import { IFinalizeInvoicePort } from '../../ports/finalize-invoice.port';
import { OrderStatus } from '../../../../shared/domain/enums/order-status.enum';

export class CompleteOrderUseCase {
  public constructor(
    private readonly ordersRepository: IOrdersRepository,
    private readonly finalizeInvoicePort: IFinalizeInvoicePort,
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

    order.pullDomainEvents();

    return { id, status: order.getStatus() };
  }
}

export const completeOrderUseCaseFactory = (
  ordersRepository: IOrdersRepository,
  finalizeInvoicePort: IFinalizeInvoicePort,
): CompleteOrderUseCase =>
  new CompleteOrderUseCase(ordersRepository, finalizeInvoicePort);
