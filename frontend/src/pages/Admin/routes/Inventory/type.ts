export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  variantName: string;
  quantity: number;
  minThreshold: number;
  location: string;
  price?: number;
}
