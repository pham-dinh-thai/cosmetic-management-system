import { Invoice } from '../../../../domain/invoice.aggregate';

export class InvoiceReadModel {
  private constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly totalAmount: number,
    public readonly paidAmount: number,
    public readonly unpaidBalance: number,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly note?: string,
  ) {}

  public static from(invoice: Invoice): InvoiceReadModel {
    return new InvoiceReadModel(
      invoice.getId(),
      invoice.getCode(),
      invoice.getOrderId(),
      invoice.getCustomerId(),
      invoice.getTotalAmount(),
      invoice.getPaidAmount(),
      invoice.getUnpaidBalance(),
      invoice.getStatus(),
      invoice.getCreatedAt() ?? new Date(),
      invoice.getNote(),
    );
  }
}
