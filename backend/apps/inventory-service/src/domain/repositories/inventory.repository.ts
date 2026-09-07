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
    minStock?: number,
  ): Promise<{ id: string }>;
  addStock(
    variantId: string,
    quantity: number,
    expiryDate?: Date,
    minStock?: number,
  ): Promise<Inventory>;
  removeStock(variantId: string, quantity: number): Promise<Inventory>;
  adjust(id: string, adjustment: number): Promise<Inventory | null>;
  updateMinStock(id: string, minStock: number): Promise<Inventory | null>;
  delete(id: string): Promise<boolean>;
}

export const INVENTORY_REPOSITORY = 'IInventoryRepository';
