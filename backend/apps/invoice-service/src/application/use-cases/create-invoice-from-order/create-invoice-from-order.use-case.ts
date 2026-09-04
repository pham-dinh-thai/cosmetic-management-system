import { Invoice } from '../../../domain/invoice.aggregate';
import { InvoicesRepository } from '../../../domain/repositories/invoices.repository';
import { InvoiceCode } from '../../../domain/value-objects/invoice-code.value-object';
import { OrderCompletedEvent } from '@app/rabbitmq';

export class CreateInvoiceFromOrderUseCase {
  public constructor(private readonly invoicesRepository: InvoicesRepository) {}

  public async execute(
    event: OrderCompletedEvent,
  ): Promise<{ id: string } | null> {
    const existing = await this.invoicesRepository.findByOrderId(event.orderId);

    if (existing) {
      return null;
    }

    const code = InvoiceCode.generate(
      (await this.invoicesRepository.count()) + 1,
    );

    const invoice = Invoice.create({
      code: code.getValue(),
      orderId: event.orderId,
      customerId: event.customerId,
      totalAmount: event.totalAmount,
    });

    return await this.invoicesRepository.create(invoice);
  }
}

export const createInvoiceFromOrderUseCaseFactory = (
  invoicesRepository: InvoicesRepository,
): CreateInvoiceFromOrderUseCase =>
  new CreateInvoiceFromOrderUseCase(invoicesRepository);
