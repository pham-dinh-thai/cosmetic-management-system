import { Inventory } from '../inventory.aggregate';

export interface IInventoriesRepository {
  findAll(): Promise<Inventory[]>;

  findById(id: string): Promise<Inventory | null>;

  findByVariantId(variantId: string): Promise<Inventory | null>;

  create(inventory: Inventory): Promise<void>;

  updateMinStock(inventory: Inventory): Promise<void>;

  setIsActive(inventory: Inventory): Promise<void>;
}

export const INVENTORIES_REPOSITORY = 'IInventoriesRepository';
