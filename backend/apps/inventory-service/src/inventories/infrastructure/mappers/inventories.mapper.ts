import { Inventory as InventoryMikro } from '../entities/inventory.entity';
import { Inventory } from '../../domain/inventory.aggregate';

export class InventoriesMapper {
  public static toDomain(inventoryMikro: InventoryMikro): Inventory {
    return Inventory.fromPersistent({
      id: inventoryMikro.id,
      variantId: inventoryMikro.variantId,
      batches: inventoryMikro.batches.getItems().map((batch) => ({
        id: batch.id,
        lotNumber: batch.lotNumber,
        supplierId: batch.supplierId,
        quantity: batch.quantity,
        expiredDate: new Date(batch.expiryDate),
        isActive: batch.isActive,
        createdBy: batch.createdBy,
        createdAt: new Date(batch.createdAt),
        updatedAt: new Date(batch.updatedAt),
      })),
      minStock: inventoryMikro.minStock,
      isActive: inventoryMikro.isActive,
      createdAt: new Date(inventoryMikro.createdAt),
      updatedAt: new Date(inventoryMikro.updatedAt),
    });
  }
}
