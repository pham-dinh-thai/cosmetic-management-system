import { Receipt } from '../../../../domain/receipt.aggregate';
import { ReceiptSource } from '../../../../domain/types';

export class ReceiptReadModel {
  private constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly amount: number,
    public readonly source: ReceiptSource,
    public readonly invoiceId: string | null,
    public readonly customerId: string | null,
    public readonly note: string | null,
    public readonly employeeId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static from(receipt: Receipt): ReceiptReadModel {
    return new ReceiptReadModel(
      receipt.getId(),
      receipt.getCode(),
      receipt.getAmount(),
      receipt.getSource(),
      receipt.getInvoiceId() ?? null,
      receipt.getCustomerId() ?? null,
      receipt.getNote() ?? null,
      receipt.getEmployeeId() ?? null,
      receipt.getCreatedAt() ?? new Date(),
      receipt.getUpdatedAt() ?? new Date(),
    );
  }
}