import { Invoice } from '../../../domain/invoice.aggregate';
import { InvoicesRepository } from '../../../domain/repositories/invoices.repository';
import { InvoiceCode } from '../../../domain/value-objects/invoice-code.value-object';

export type CreateInvoiceFromOrderInput = {
  orderId: string;
  code: string;
  customerId: string;
  totalAmount: number;
  paid?: boolean;
  employeeId?: string;
};

export class CreateInvoiceFromOrderUseCase {
  public constructor(
    private readonly invoicesRepository: InvoicesRepository,
  ) {}

  public async execute(
    input: CreateInvoiceFromOrderInput,
  ): Promise<{ id: string } | null> {
    const existing = await this.invoicesRepository.findByOrderId(input.orderId);

    if (existing) {
      return null;
    }

    const maxCodeSequence = await this.invoicesRepository.findMaxCodeSequence();
    const code = InvoiceCode.generate((maxCodeSequence ?? 0) + 1);

    const invoice = Invoice.create({
      code: code.getValue(),
      orderId: input.orderId,
      customerId: input.customerId,
      totalAmount: input.totalAmount,
    });

    if (input.paid && input.totalAmount > 0) {
      invoice.applyPayment(input.totalAmount);
    }

    return await this.invoicesRepository.create(invoice);
  }
}

export const createInvoiceFromOrderUseCaseFactory = (
  invoicesRepository: InvoicesRepository,
): CreateInvoiceFromOrderUseCase =>
  new CreateInvoiceFromOrderUseCase(invoicesRepository);
