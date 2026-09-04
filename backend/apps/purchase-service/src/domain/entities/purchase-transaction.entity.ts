import { InvalidPurchaseOrderLineException } from '../exceptions/invalid-purchase-order-line.exception';
import {
  CreatePurchaseTransactionProps,
  FromPersistentPurchaseTransactionProps,
} from '../types';

export class PurchaseTransaction {
  private constructor(
    private readonly id: string,
    private readonly purchaseOrderId: string,
    private readonly variantId: string,
    private readonly quantity: number,
    private readonly unitPrice: number,
    private readonly subtotal: number,
    private readonly employeeId: string,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(
    props: CreatePurchaseTransactionProps,
  ): PurchaseTransaction {
    if (!Number.isInteger(props.quantity) || props.quantity <= 0) {
      throw new InvalidPurchaseOrderLineException(
        'Quantity must be a positive integer',
      );
    }

    if (!Number.isFinite(props.unitPrice) || props.unitPrice < 0) {
      throw new InvalidPurchaseOrderLineException(
        'Unit price must be a non-negative number',
      );
    }

    if (!props.employeeId) {
      throw new InvalidPurchaseOrderLineException(
        'Employee id must not be empty',
      );
    }

    return new PurchaseTransaction(
      undefined as unknown as string,
      props.purchaseOrderId,
      props.variantId,
      props.quantity,
      props.unitPrice,
      props.quantity * props.unitPrice,
      props.employeeId,
    );
  }

  public static fromPersistent(
    props: FromPersistentPurchaseTransactionProps,
  ): PurchaseTransaction {
    return new PurchaseTransaction(
      props.id,
      props.purchaseOrderId,
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

  public getPurchaseOrderId(): string {
    return this.purchaseOrderId;
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
