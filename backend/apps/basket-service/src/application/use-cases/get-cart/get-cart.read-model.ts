export interface IGetCartRequest {
  userId: string;
}

export class CartItemReadModel {
  public constructor(
    public readonly variantId: string,
    public readonly name: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly lineTotal: number,
  ) {}
}

export class CartReadModel {
  public constructor(
    public readonly id: string | null,
    public readonly customerId: string,
    public readonly status: string,
    public readonly items: CartItemReadModel[],
    public readonly total: number,
  ) {}

  public static empty(customerId: string): CartReadModel {
    return new CartReadModel(null, customerId, 'OPEN', [], 0);
  }
}
