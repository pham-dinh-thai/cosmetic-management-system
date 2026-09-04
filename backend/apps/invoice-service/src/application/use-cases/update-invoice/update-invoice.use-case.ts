import { InvoiceNotFoundException } from '../../../domain/exceptions/invoice-not-found.exception';
import { InvoicesRepository } from '../../../domain/repositories/invoices.repository';
import { IUpdateInvoiceRequest } from './update-invoice.request';

export class UpdateInvoiceUseCase {
  public constructor(private readonly invoicesRepository: InvoicesRepository) {}

  public async execute(
    id: string,
    request: IUpdateInvoiceRequest,
  ): Promise<void> {
    const invoice = await this.invoicesRepository.findById(id);

    if (!invoice) {
      throw new InvoiceNotFoundException(id);
    }

    const updated = await this.invoicesRepository.updateNote(id, request.note);

    if (!updated) {
      throw new InvoiceNotFoundException(id);
    }
  }
}

export const updateInvoiceUseCaseFactory = (
  invoicesRepository: InvoicesRepository,
): UpdateInvoiceUseCase => new UpdateInvoiceUseCase(invoicesRepository);
