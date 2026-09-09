export interface InventoryItem {
  id: string;
  variantId: string;
  quantity: number;
  minStock: number;
  expiryDate: string | null;
  lastUpdatedAt: string;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
  createdByName?: string;
  sku?: string;
  productName?: string;
  variantName?: string;
  minThreshold?: number;
  location?: string;
  price?: number;
}