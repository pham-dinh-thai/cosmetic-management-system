export class OverstockInventoryReadModel {
  public constructor(
    public readonly id: string,
    public readonly variantId: string,
    public readonly quantity: number,
    public readonly inactiveDays: number,
    public readonly lastUpdatedAt: Date,
  ) {}
}
