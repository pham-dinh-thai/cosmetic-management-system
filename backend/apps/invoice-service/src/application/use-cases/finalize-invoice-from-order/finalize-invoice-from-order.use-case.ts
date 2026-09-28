import { ICreateReceiptPort } from '../../../domain/ports/create-receipt.port';
import { InvoicesRepository } from '../../../domain/repositories/invoices.repository';

export type FinalizeInvoiceFromOrderInput = {
  orderId: string;
  employeeId?: string;
};

export class FinalizeInvoiceFromOrderUseCase {
  public constructor(
    private readonly invoicesRepository: InvoicesRepository,
    private readonly createReceiptPort: ICreateReceiptPort,
  ) {}

  public async execute(
    input: FinalizeInvoiceFromOrderInput,
  ): Promise<{ id: string } | null> {
    const invoice = await this.invoicesRepository.findByOrderId(input.orderId);

    if (!invoice) {
      return null;
    }

    const unpaidBalance = invoice.getUnpaidBalance();

    if (unpaidBalance > 0) {
      await this.invoicesRepository.recordPayment(
        invoice.getId(),
        unpaidBalance,
      );
    }

    await this.createReceiptPort.execute({
      invoiceId: invoice.getId(),
      customerId: invoice.getCustomerId(),
      amount: invoice.getTotalAmount(),
      note: `Thu tiền bán hàng theo hóa đơn ${invoice.getCode()}`,
      employeeId: input.employeeId,
      dedupe: true,
    });

    return { id: invoice.getId() };
  }
}

export const finalizeInvoiceFromOrderUseCaseFactory = (
  invoicesRepository: InvoicesRepository,
  createReceiptPort: ICreateReceiptPort,
): FinalizeInvoiceFromOrderUseCase =>
  new FinalizeInvoiceFromOrderUseCase(invoicesRepository, createReceiptPort);