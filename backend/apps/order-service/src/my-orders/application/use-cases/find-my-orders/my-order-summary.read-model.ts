import { Order } from '../../../../orders/domain/order.aggregate';

export class MyOrderSummaryReadModel {
  private constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly customerId: string | null,
    public readonly customerName: string | null,
    public readonly paymentMethod: string,
    public readonly paymentStatus: string,
    public readonly status: string,
    public readonly totalAmount: number,
    public readonly createdAt: Date,
  ) {}

  public static from(
    order: Order,
    customerName: string | null,
  ): MyOrderSummaryReadModel {
    return new MyOrderSummaryReadModel(
      order.getId(),
      order.getCode(),
      order.getCustomerId(),
      customerName,
      order.getPaymentMethod(),
      order.getPaymentStatus(),
      order.getStatus(),
      order.getTotalAmount(),
      order.getCreatedAt(),
    );
  }
}
