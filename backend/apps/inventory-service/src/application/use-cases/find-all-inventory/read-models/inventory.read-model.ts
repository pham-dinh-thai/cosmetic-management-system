export class InventoryReadModel {
  public constructor(
    public readonly id: string,
    public readonly variantId: string,
    public readonly quantity: number,
    public readonly lastUpdatedAt: Date,
    public readonly createdAt: Date | undefined,
    public readonly updatedAt: Date | undefined,
    public readonly expiryDate: Date | undefined,
  ) {}
}
