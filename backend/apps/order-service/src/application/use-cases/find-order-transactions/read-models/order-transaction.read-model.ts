import { OrderTransaction } from '../../../../domain/entities/order-transaction.entity';

export class OrderTransactionReadModel {
  private constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly variantId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly subtotal: number,
    public readonly employeeId: string,
    public readonly createdAt: Date,
  ) {}

  public static from(transaction: OrderTransaction): OrderTransactionReadModel {
    return new OrderTransactionReadModel(
      transaction.getId(),
      transaction.getOrderId(),
      transaction.getVariantId(),
      transaction.getQuantity(),
      transaction.getUnitPrice(),
      transaction.getSubtotal(),
      transaction.getEmployeeId(),
      transaction.getCreatedAt() ?? new Date(),
    );
  }
}
