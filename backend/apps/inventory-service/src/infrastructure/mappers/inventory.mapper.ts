import { Inventory as InventoryMikro } from '../entities/inventory.entity';
import { Inventory } from '../../domain/inventory.aggregate';

export class InventoryMapper {
  public static toDomain(inventoryMikro: InventoryMikro): Inventory {
    return Inventory.fromPersistent({
      id: inventoryMikro.id,
      variantId: inventoryMikro.variantId,
      quantity: inventoryMikro.quantity,
      expiryDate: inventoryMikro.expiryDate
        ? new Date(`${inventoryMikro.expiryDate}T00:00:00`)
        : undefined,
      lastUpdatedAt: inventoryMikro.lastUpdatedAt,
      createdAt: inventoryMikro.createdAt,
      updatedAt: inventoryMikro.updatedAt,
    });
  }
}
