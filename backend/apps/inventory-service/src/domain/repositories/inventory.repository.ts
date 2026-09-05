import { Inventory } from '../inventory.aggregate';

export interface IInventoryRepository {
  findAll(): Promise<Inventory[]>;
  findById(id: string): Promise<Inventory | null>;
  findByVariantId(variantId: string): Promise<Inventory | null>;
  findExpiring(days: number): Promise<Inventory[]>;
  findOverstock(days: number): Promise<Inventory[]>;
  create(
    variantId: string,
    quantity: number,
    expiryDate?: Date,
  ): Promise<{ id: string }>;
  addStock(
    variantId: string,
    quantity: number,
    expiryDate?: Date,
  ): Promise<Inventory>;
  removeStock(variantId: string, quantity: number): Promise<Inventory>;
  adjust(id: string, adjustment: number): Promise<Inventory | null>;
}

export const INVENTORY_REPOSITORY = 'IInventoryRepository';
