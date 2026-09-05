export class ExpiringInventoryReadModel {
  public constructor(
    public readonly id: string,
    public readonly variantId: string,
    public readonly quantity: number,
    public readonly expiryDate: Date,
    public readonly daysLeft: number,
    public readonly lastUpdatedAt: Date,
  ) {}
}
