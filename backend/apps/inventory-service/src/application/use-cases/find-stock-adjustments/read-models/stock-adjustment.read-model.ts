export class StockAdjustmentReadModel {
  public constructor(
    public readonly id: string,
    public readonly inventoryId: string,
    public readonly variantId: string,
    public readonly adjustment: number,
    public readonly reason: string,
    public readonly note: string | null,
    public readonly createdBy: string,
    public readonly createdAt: Date,
  ) {}
}
