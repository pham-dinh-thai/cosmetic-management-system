import { InvoiceNotFoundException } from '../../../domain/exceptions/invoice-not-found.exception';
import { InvoicesRepository } from '../../../domain/repositories/invoices.repository';
import { InvoiceReadModel } from '../find-all-invoices/read-models/invoice.read-model';

export class FindInvoiceByIdUseCase {
  public constructor(private readonly invoicesRepository: InvoicesRepository) {}

  public async execute(id: string): Promise<InvoiceReadModel> {
    const invoice = await this.invoicesRepository.findById(id);

    if (!invoice) {
      throw new InvoiceNotFoundException(id);
    }

    return InvoiceReadModel.from(invoice);
  }
}

export const findInvoiceByIdUseCaseFactory = (
  invoicesRepository: InvoicesRepository,
): FindInvoiceByIdUseCase => new FindInvoiceByIdUseCase(invoicesRepository);
