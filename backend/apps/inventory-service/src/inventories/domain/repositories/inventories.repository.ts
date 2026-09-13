import { Inventory } from '../inventory.aggregate';

export interface IInventoriesRepository {
  findById(id: string): Promise<Inventory | null>;

  setIsActive(inventory: Inventory): Promise<void>;
}

export const INVENTORIES_REPOSITORY = 'IInventoriesRepository';
