import { InvoiceNotFoundException } from '../../../domain/exceptions/invoice-not-found.exception';
import { InvoicesRepository } from '../../../domain/repositories/invoices.repository';
import { InvoiceReadModel } from '../find-all-invoices/read-models/invoice.read-model';

export class RecordPaymentUseCase {
  public constructor(private readonly invoicesRepository: InvoicesRepository) {}

  public async execute(id: string, amount: number): Promise<InvoiceReadModel> {
    const invoice = await this.invoicesRepository.recordPayment(id, amount);

    if (!invoice) {
      throw new InvoiceNotFoundException(id);
    }

    return InvoiceReadModel.from(invoice);
  }
}

export const recordPaymentUseCaseFactory = (
  invoicesRepository: InvoicesRepository,
): RecordPaymentUseCase => new RecordPaymentUseCase(invoicesRepository);
