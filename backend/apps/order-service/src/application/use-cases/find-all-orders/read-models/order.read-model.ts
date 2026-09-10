import { Order } from '../../../../domain/order.aggregate';

export class OrderReadModel {
  private constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly customerId: string,
    public readonly paymentMethod: string,
    public readonly status: string,
    public readonly totalAmount: number,
    public readonly createdAt: Date,
  ) {}

  public static from(order: Order): OrderReadModel {
    return new OrderReadModel(
      order.getId(),
      order.getCode(),
      order.getCustomerId(),
      order.getPaymentMethod(),
      order.getStatus(),
      order.getTotalAmount(),
      order.getCreatedAt() ?? new Date(),
    );
  }
}
