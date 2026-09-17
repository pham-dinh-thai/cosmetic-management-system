import { Invoice } from '../../../domain/invoice.aggregate';
import { ICreateReceiptPort } from '../../../domain/ports/create-receipt.port';
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
    private readonly createReceiptPort: ICreateReceiptPort,
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

    const created = await this.invoicesRepository.create(invoice);

    if (input.paid && input.totalAmount > 0) {
      await this.createReceiptPort.execute({
        invoiceId: created.id,
        customerId: input.customerId,
        amount: input.totalAmount,
        note: `Thu tiền bán hàng theo hóa đơn ${invoice.getCode()}`,
        employeeId: input.employeeId,
      });
    }

    return created;
  }
}

export const createInvoiceFromOrderUseCaseFactory = (
  invoicesRepository: InvoicesRepository,
  createReceiptPort: ICreateReceiptPort,
): CreateInvoiceFromOrderUseCase =>
  new CreateInvoiceFromOrderUseCase(invoicesRepository, createReceiptPort);
