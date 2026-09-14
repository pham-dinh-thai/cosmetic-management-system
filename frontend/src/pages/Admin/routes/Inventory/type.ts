export interface InventoryBatch {
  id: string;
  lotNumber: string;
  supplierId: string;
  supplierName?: string;
  quantity: number;
  expiredDate: string;
  isActive: boolean;
}

export interface InventoryItem {
  id: string;
  variantId: string;
  quantity: number;
  minStock: number;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  batches: InventoryBatch[];
  sku?: string;
  productName?: string;
  variantName?: string;
  minThreshold?: number;
  location?: string;
  price?: number;
}