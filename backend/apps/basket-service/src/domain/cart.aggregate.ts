import { CartItem } from './entities/cart-item.entity';
import { CartStatus, CreateCartProps, FromPersistentCartProps } from './types';
import { CartItemNotFoundException } from './exceptions/cart-item-not-found.exception';

export class Cart {
  public constructor(
    private readonly id: string,
    private readonly customerId: string,
    private status: CartStatus,
    private items: CartItem[],
    private readonly createdAt?: Date,
    private readonly updatedAt?: Date,
  ) {}

  public static create(props: CreateCartProps): Cart {
    return new Cart(
      undefined as unknown as string,
      props.customerId,
      CartStatus.OPEN,
      [],
    );
  }

  public static fromPersistent(props: FromPersistentCartProps): Cart {
    return new Cart(
      props.id,
      props.customerId,
      props.status,
      props.items.map((item) => CartItem.fromPersistent(item)),
      props.createdAt,
      props.updatedAt,
    );
  }

  public getId(): string {
    return this.id;
  }

  public getCustomerId(): string {
    return this.customerId;
  }

  public getStatus(): CartStatus {
    return this.status;
  }

  public getItems(): CartItem[] {
    return this.items;
  }

  public hasItem(variantId: string): boolean {
    return this.items.some((item) => item.getVariantId() === variantId);
  }

  public getCreatedAt(): Date | undefined {
    return this.createdAt;
  }

  public getUpdatedAt(): Date | undefined {
    return this.updatedAt;
  }

  public addItem(variantId: string, quantity: number): void {
    const existing = this.items.find(
      (item) => item.getVariantId() === variantId,
    );

    if (existing) {
      existing.increase(quantity);
      return;
    }

    this.items.push(CartItem.create({ variantId, quantity }));
  }

  public updateQuantity(variantId: string, quantity: number): void {
    const item = this.items.find((item) => item.getVariantId() === variantId);

    if (!item) {
      throw new CartItemNotFoundException(variantId);
    }

    item.setQuantity(quantity);
  }

  public removeItem(variantId: string): void {
    const index = this.items.findIndex(
      (item) => item.getVariantId() === variantId,
    );

    if (index === -1) {
      throw new CartItemNotFoundException(variantId);
    }

    this.items.splice(index, 1);
  }

  public hasItems(): boolean {
    return this.items.length > 0;
  }

  public markCheckedOut(): void {
    this.status = CartStatus.CHECKED_OUT;
  }
}
