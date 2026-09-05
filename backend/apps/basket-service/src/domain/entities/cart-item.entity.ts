import { CartItemProps } from '../types';

export class CartItem {
  public constructor(
    private readonly variantId: string,
    private quantity: number,
  ) {}

  public static create(props: CartItemProps): CartItem {
    return new CartItem(props.variantId, props.quantity);
  }

  public static fromPersistent(props: CartItemProps): CartItem {
    return new CartItem(props.variantId, props.quantity);
  }

  public getVariantId(): string {
    return this.variantId;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  public increase(quantity: number): void {
    this.quantity += quantity;
  }

  public setQuantity(quantity: number): void {
    this.quantity = quantity;
  }
}
