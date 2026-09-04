import { Order } from '../../../../domain/order.aggregate';

export type OrderDetailLineReadModel = {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export class OrderDetailReadModel {
  private constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly customerId: string,
    public readonly status: string,
    public readonly totalAmount: number,
    public readonly lines: OrderDetailLineReadModel[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static from(order: Order): OrderDetailReadModel {
    return new OrderDetailReadModel(
      order.getId(),
      order.getCode(),
      order.getCustomerId(),
      order.getStatus(),
      order.getTotalAmount(),
      order.getLines().map((line) => ({
        id: line.getId(),
        variantId: line.getVariantId(),
        quantity: line.getQuantity(),
        unitPrice: line.getUnitPrice(),
        subtotal: line.getSubtotal(),
      })),
      order.getCreatedAt() ?? new Date(),
      order.getUpdatedAt() ?? new Date(),
    );
  }
}
