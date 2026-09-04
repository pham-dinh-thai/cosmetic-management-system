import { PurchaseTransaction } from '../../../../domain/entities/purchase-transaction.entity';

export class PurchaseTransactionReadModel {
  private constructor(
    public readonly id: string,
    public readonly purchaseOrderId: string,
    public readonly variantId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly subtotal: number,
    public readonly employeeId: string,
    public readonly createdAt: Date,
  ) {}

  public static from(
    transaction: PurchaseTransaction,
  ): PurchaseTransactionReadModel {
    return new PurchaseTransactionReadModel(
      transaction.getId(),
      transaction.getPurchaseOrderId(),
      transaction.getVariantId(),
      transaction.getQuantity(),
      transaction.getUnitPrice(),
      transaction.getSubtotal(),
      transaction.getEmployeeId(),
      transaction.getCreatedAt() ?? new Date(),
    );
  }
}
