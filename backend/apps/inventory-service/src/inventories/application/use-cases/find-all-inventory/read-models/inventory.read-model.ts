import { Inventory } from '../../../../domain/inventory.aggregate';

export class InventoryReadModel {
  public constructor(
    public readonly id: string,
    public readonly variantId: string,
    public readonly quantity: number,
    public readonly minStock: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly batches: {
      id: string;
      lotNumber: string;
      supplierId: string;
      quantity: number;
      expiredDate: Date;
      isActive: boolean;
    }[],
  ) {}

  public static toReadModel(inventory: Inventory): InventoryReadModel {
    const totalQuantity = inventory
      .getBatches()
      .filter((batch) => batch.getIsActive())
      .reduce((sum, batch) => sum + batch.getQuantity(), 0);

    return new InventoryReadModel(
      inventory.getId(),
      inventory.getVariantId(),
      totalQuantity,
      inventory.getMinStock(),
      inventory.getIsActive(),
      inventory.getCreatedAt(),
      inventory.getUpdatedAt(),
      inventory
        .getBatches()
        .map((batch) => ({
          id: batch.getId(),
          lotNumber: batch.getLotNumber(),
          supplierId: batch.getSupplierId(),
          quantity: batch.getQuantity(),
          expiredDate: batch.getExpiredDate(),
          isActive: batch.getIsActive(),
        })),
    );
  }
}