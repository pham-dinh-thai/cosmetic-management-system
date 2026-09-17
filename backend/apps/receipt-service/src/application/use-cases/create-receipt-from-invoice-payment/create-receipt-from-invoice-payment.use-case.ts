import { Receipt } from '../../../domain/receipt.aggregate';
import { ReceiptSource } from '../../../domain/types';
import { ReceiptsRepository } from '../../../domain/repositories/receipts.repository';
import { ReceiptCode } from '../../../domain/value-objects/receipt-code.value-object';

export type CreateReceiptFromInvoicePaymentEvent = {
  invoiceId: string;
  customerId?: string;
  amount: number;
  note?: string;
  employeeId?: string;
};

export class CreateReceiptFromInvoicePaymentUseCase {
  public constructor(private readonly receiptsRepository: ReceiptsRepository) {}

  public async execute(
    event: CreateReceiptFromInvoicePaymentEvent,
  ): Promise<{ id: string } | null> {
    const maxCodeSequence = await this.receiptsRepository.findMaxCodeSequence();
    const code = ReceiptCode.generate((maxCodeSequence ?? 0) + 1);

    const receipt = Receipt.create({
      code: code.getValue(),
      amount: event.amount,
      source: ReceiptSource.AUTO_INVOICE_PAYMENT,
      invoiceId: event.invoiceId,
      customerId: event.customerId,
      note: event.note,
      employeeId: event.employeeId,
    });

    return await this.receiptsRepository.create(receipt);
  }
}

export const createReceiptFromInvoicePaymentUseCaseFactory = (
  receiptsRepository: ReceiptsRepository,
): CreateReceiptFromInvoicePaymentUseCase =>
  new CreateReceiptFromInvoicePaymentUseCase(receiptsRepository);