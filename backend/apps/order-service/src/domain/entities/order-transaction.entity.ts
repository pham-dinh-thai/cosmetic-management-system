import { InvalidOrderLineException } from '../exceptions/invalid-order-line.exception';
import {
  CreateOrderTransactionProps,
  FromPersistentOrderTransactionProps,
} from '../types';

export class OrderTransaction {
  private constructor(
    private readonly id: string,
    private readonly orderId: string,
    private readonly variantId: string,
    private readonly quantity: number,
    private readonly unitPrice: number,
    private readonly subtotal: number,
    private readonly employeeId: string,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreateOrderTransactionProps): OrderTransaction {
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

    if (!props.employeeId) {
      throw new InvalidOrderLineException('Employee id must not be empty');
    }

    return new OrderTransaction(
      undefined as unknown as string,
      props.orderId,
      props.variantId,
      props.quantity,
      props.unitPrice,
      props.quantity * props.unitPrice,
      props.employeeId,
    );
  }

  public static fromPersistent(
    props: FromPersistentOrderTransactionProps,
  ): OrderTransaction {
    return new OrderTransaction(
      props.id,
      props.orderId,
      props.variantId,
      props.quantity,
      props.unitPrice,
      props.subtotal,
      props.employeeId,
      props.createdAt,
      props.updatedAt,
    );
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

  public getSubtotal(): number {
    return this.subtotal;
  }

  public getEmployeeId(): string {
    return this.employeeId;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}
