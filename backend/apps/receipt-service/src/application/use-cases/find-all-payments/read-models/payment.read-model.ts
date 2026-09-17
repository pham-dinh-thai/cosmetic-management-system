import { Payment } from '../../../../domain/payment.aggregate';
import { PaymentCategory, PaymentSource } from '../../../../domain/types';

export class PaymentReadModel {
  private constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly amount: number,
    public readonly category: PaymentCategory,
    public readonly source: PaymentSource,
    public readonly purchaseOrderId: string | null,
    public readonly supplierId: string | null,
    public readonly note: string | null,
    public readonly employeeId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static from(payment: Payment): PaymentReadModel {
    return new PaymentReadModel(
      payment.getId(),
      payment.getCode(),
      payment.getAmount(),
      payment.getCategory(),
      payment.getSource(),
      payment.getPurchaseOrderId() ?? null,
      payment.getSupplierId() ?? null,
      payment.getNote() ?? null,
      payment.getEmployeeId() ?? null,
      payment.getCreatedAt() ?? new Date(),
      payment.getUpdatedAt() ?? new Date(),
    );
  }
}