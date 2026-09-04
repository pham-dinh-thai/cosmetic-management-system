import { InvalidPurchaseOrderLineException } from '../exceptions/invalid-purchase-order-line.exception';
import {
  CreatePurchaseOrderLineProps,
  FromPersistentPurchaseOrderLineProps,
} from '../types';

export class PurchaseOrderLine {
  private constructor(
    private readonly id: string,
    private readonly purchaseOrderId: string,
    private readonly variantId: string,
    private readonly quantity: number,
    private readonly unitPrice: number,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreatePurchaseOrderLineProps): PurchaseOrderLine {
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

    return new PurchaseOrderLine(
      undefined as unknown as string,
      undefined as unknown as string,
      props.variantId,
      props.quantity,
      props.unitPrice,
    );
  }

  public static fromPersistent(
    props: FromPersistentPurchaseOrderLineProps,
  ): PurchaseOrderLine {
    return new PurchaseOrderLine(
      props.id,
      props.purchaseOrderId,
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
}
