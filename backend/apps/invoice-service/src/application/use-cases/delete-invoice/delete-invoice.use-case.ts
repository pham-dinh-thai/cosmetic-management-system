import { InvoiceNotFoundException } from '../../../domain/exceptions/invoice-not-found.exception';
import { InvoicesRepository } from '../../../domain/repositories/invoices.repository';

export class DeleteInvoiceUseCase {
  public constructor(private readonly invoicesRepository: InvoicesRepository) {}

  public async execute(id: string): Promise<void> {
    const invoice = await this.invoicesRepository.findById(id);

    if (!invoice) {
      throw new InvoiceNotFoundException(id);
    }

    const deleted = await this.invoicesRepository.delete(id);

    if (!deleted) {
      throw new InvoiceNotFoundException(id);
    }
  }
}

export const deleteInvoiceUseCaseFactory = (
  invoicesRepository: InvoicesRepository,
): DeleteInvoiceUseCase => new DeleteInvoiceUseCase(invoicesRepository);
