import { InvoiceStatus } from '../../../domain/types';
import { InvoicesRepository } from '../../../domain/repositories/invoices.repository';
import { InvoiceReadModel } from './read-models/invoice.read-model';

export class FindAllInvoicesUseCase {
  public constructor(private readonly invoicesRepository: InvoicesRepository) {}

  public async execute(options?: {
    search?: string;
    status?: InvoiceStatus;
    orderId?: string;
    customerId?: string;
  }): Promise<InvoiceReadModel[]> {
    const invoices = await this.invoicesRepository.findAll(options);
    return invoices.map((invoice) => InvoiceReadModel.from(invoice));
  }
}

export const findAllInvoicesUseCaseFactory = (
  invoicesRepository: InvoicesRepository,
): FindAllInvoicesUseCase => new FindAllInvoicesUseCase(invoicesRepository);
