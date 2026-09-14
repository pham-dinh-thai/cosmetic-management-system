import { Batch } from '../entities/batch.entity';
import { Inventory } from '../inventory.aggregate';

export interface IInventoriesRepository {
  findAll(): Promise<Inventory[]>;

  findById(id: string): Promise<Inventory | null>;

  findByVariantId(variantId: string): Promise<Inventory | null>;

  create(inventory: Inventory): Promise<void>;

  updateMinStock(inventory: Inventory): Promise<void>;

  setIsActive(inventory: Inventory): Promise<void>;

  addBatch(id: string, batch: Batch): Promise<void>;

  setBatchStatus(batch: Batch): Promise<void>;

  updateBatchQuantities(batches: Batch[]): Promise<void>;
}

export const INVENTORIES_REPOSITORY = 'IInventoriesRepository';
