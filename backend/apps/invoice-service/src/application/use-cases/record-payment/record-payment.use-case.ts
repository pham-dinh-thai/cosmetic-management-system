import { InvoiceNotFoundException } from '../../../domain/exceptions/invoice-not-found.exception';
import { ICreateReceiptPort } from '../../../domain/ports/create-receipt.port';
import { InvoicesRepository } from '../../../domain/repositories/invoices.repository';
import { InvoiceReadModel } from '../find-all-invoices/read-models/invoice.read-model';

export class RecordPaymentUseCase {
  public constructor(
    private readonly invoicesRepository: InvoicesRepository,
    private readonly createReceiptPort: ICreateReceiptPort,
  ) {}

  public async execute(id: string, amount: number): Promise<InvoiceReadModel> {
    const invoice = await this.invoicesRepository.recordPayment(id, amount);

    if (!invoice) {
      throw new InvoiceNotFoundException(id);
    }

    await this.createReceiptPort.execute({
      invoiceId: invoice.getId(),
      customerId: invoice.getCustomerId(),
      amount,
      note: `Thu tiền khách hàng theo hóa đơn ${invoice.getCode()}`,
    });

    return InvoiceReadModel.from(invoice);
  }
}

export const recordPaymentUseCaseFactory = (
  invoicesRepository: InvoicesRepository,
  createReceiptPort: ICreateReceiptPort,
): RecordPaymentUseCase =>
  new RecordPaymentUseCase(invoicesRepository, createReceiptPort);