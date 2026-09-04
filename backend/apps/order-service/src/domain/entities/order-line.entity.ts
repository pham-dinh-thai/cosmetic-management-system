import { InvalidOrderLineException } from '../exceptions/invalid-order-line.exception';
import { CreateOrderLineProps, FromPersistentOrderLineProps } from '../types';

export class OrderLine {
  private constructor(
    private readonly id: string,
    private readonly orderId: string,
    private readonly variantId: string,
    private readonly quantity: number,
    private readonly unitPrice: number,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreateOrderLineProps): OrderLine {
    if (!Number.isInteger(props.quantity) || props.quantity <= 0) {
      throw new InvalidOrderLineException(
        'Quantity must be a positive integer',
      );
    }

    if (!Number.isFinite(props.unitPrice) || props.unitPrice < 0) {
      throw new InvalidOrderLineException(
        'Unit price must be a non-negative number',
      );
    }

    return new OrderLine(
      undefined as unknown as string,
      undefined as unknown as string,
      props.variantId,
      props.quantity,
      props.unitPrice,
    );
  }

  public static fromPersistent(props: FromPersistentOrderLineProps): OrderLine {
    return new OrderLine(
      props.id,
      props.orderId,
      props.variantId,
      props.quantity,
      props.unitPrice,
      props.createdAt,
      props.updatedAt,
    );
  }

  public getSubtotal(): number {
    return this.quantity * this.unitPrice;
  }

  public getId(): string {
    return this.id;
  }

  public getOrderId(): string {
    return this.orderId;
  }

  public getVariantId(): string {
    return this.variantId;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getUnitPrice(): number {
    return this.unitPrice;
  }
}
