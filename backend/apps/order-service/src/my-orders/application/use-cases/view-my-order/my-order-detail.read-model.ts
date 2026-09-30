import { Order } from '../../../../shared/domain/order.aggregate';

export type MyOrderDetailLineReadModel = {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export class MyOrderDetailReadModel {
  private constructor(
    public readonly id: string,
    public readonly code: string,
    public readonly customerId: string,
    public readonly customerName: string | null,
    public readonly recipientName: string | null,
    public readonly recipientPhone: string | null,
    public readonly shippingAddress: string | null,
    public readonly shippingCity: string | null,
    public readonly paymentMethod: string,
    public readonly paymentStatus: string,
    public readonly status: string,
    public readonly totalAmount: number,
    public readonly lines: MyOrderDetailLineReadModel[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  public static from(
    order: Order,
    customerName: string | null,
  ): MyOrderDetailReadModel {
    return new MyOrderDetailReadModel(
      order.getId(),
      order.getCode(),
      order.getCustomerId(),
      customerName,
      order.getRecipientName(),
      order.getRecipientPhone(),
      order.getShippingAddress(),
      order.getShippingCity(),
      order.getPaymentMethod(),
      order.getPaymentStatus(),
      order.getStatus(),
      order.getTotalAmount(),
      order.getLines().map((line) => ({
        id: line.getId(),
        variantId: line.getVariantId(),
        quantity: line.getQuantity(),
        unitPrice: line.getUnitPrice(),
        subtotal: line.getSubtotal(),
      })),
      order.getCreatedAt(),
      order.getUpdatedAt(),
    );
  }
}
