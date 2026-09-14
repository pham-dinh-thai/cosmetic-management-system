export class BatchReadModel {
  public constructor(
    public readonly id: string,
    public readonly inventoryId: string,
    public readonly variantId: string,
    public readonly lotNumber: string,
    public readonly supplierId: string,
    public readonly quantity: number,
    public readonly expiredDate: Date,
    public readonly updatedAt: Date,
  ) {}
}