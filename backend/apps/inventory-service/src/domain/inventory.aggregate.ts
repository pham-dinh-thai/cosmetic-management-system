import { InsufficientStockException } from './exceptions/insufficient-stock.exception';
import { InvalidQuantityException } from './exceptions/invalid-quantity.exception';
import { CreateInventoryProps, FromPersistentInventoryProps } from './types';

export class Inventory {
  private constructor(
    private readonly id: string,
    private readonly variantId: string,
    private quantity: number,
    private lastUpdatedAt: Date,
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreateInventoryProps): Inventory {
    if (!Number.isInteger(props.quantity) || props.quantity < 0) {
      throw new InvalidQuantityException(
        'Quantity must be a non-negative integer',
      );
    }

    const now = new Date();

    return new Inventory(
      undefined as unknown as string,
      props.variantId,
      props.quantity,
      now,
      now,
      now,
    );
  }

  public static fromPersistent(props: FromPersistentInventoryProps): Inventory {
    return new Inventory(
      props.id,
      props.variantId,
      props.quantity,
      props.lastUpdatedAt,
      props.createdAt,
      props.updatedAt,
    );
  }

  public addStock(quantity: number): void {
    this.assertPositiveInteger(quantity);
    this.quantity += quantity;
    this.lastUpdatedAt = new Date();
  }

  public removeStock(quantity: number): void {
    this.assertPositiveInteger(quantity);

    if (this.quantity < quantity) {
      throw new InsufficientStockException(
        this.variantId,
        quantity,
        this.quantity,
      );
    }

    this.quantity -= quantity;
    this.lastUpdatedAt = new Date();
  }

  public adjust(adjustment: number): void {
    if (!Number.isInteger(adjustment)) {
      throw new InvalidQuantityException(
        'Adjustment must be an integer (negative to decrease)',
      );
    }

    if (this.quantity + adjustment < 0) {
      throw new InsufficientStockException(
        this.variantId,
        -adjustment,
        this.quantity,
      );
    }

    this.quantity += adjustment;
    this.lastUpdatedAt = new Date();
  }

  private assertPositiveInteger(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new InvalidQuantityException('Quantity must be a positive integer');
    }
  }

  public getId(): string {
    return this.id;
  }

  public getVariantId(): string {
    return this.variantId;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public getLastUpdatedAt(): Date {
    return this.lastUpdatedAt;
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }
}
