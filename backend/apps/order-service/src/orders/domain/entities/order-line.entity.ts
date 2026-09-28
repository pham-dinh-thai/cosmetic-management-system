import { InvalidOrderLineException } from '../exceptions/invalid-order-line.exception';

export type CreateOrderLineProps = {
  variantId: string;
  quantity: number;
  unitPrice: number;
};

export type FromPersistentOrderLineProps = {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  createdAt: Date;
  updatedAt: Date;
};

export class OrderLine {
  private constructor(
    private readonly id: string,
    private readonly orderId: string,
    private readonly variantId: string,
    private readonly quantity: number,
    private readonly unitPrice: number,
    private readonly createdAt: Date,
    private readonly updatedAt: Date,
  ) {}

  public static create(props: CreateOrderLineProps): OrderLine {
    if (!Number.isInteger(props.quantity) || props.quantity <= 0) {
      throw new InvalidOrderLineException(
        'Số lượng phải là số nguyên lớn hơn 0',
      );
    }

    if (!Number.isFinite(props.unitPrice) || props.unitPrice < 0) {
      throw new InvalidOrderLineException(
        'Giá đơn hàng phải là một số không âm',
      );
    }

    return new OrderLine(
      undefined as unknown as string,
      undefined as unknown as string,
      props.variantId,
      props.quantity,
      props.unitPrice,
      new Date(),
      new Date(),
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

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
