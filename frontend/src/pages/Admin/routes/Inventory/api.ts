import type { InventoryItem } from "./type";

export const inventoryApi = {
  fetchInventory: async (): Promise<InventoryItem[]> => {
    return [
      { id: "1", sku: "GUAR-CLR-50", productName: "Sữa rửa mặt vi sinh Cleanser", variantName: "50ml", quantity: 120, minThreshold: 20, location: "Kệ A1-02" },
      { id: "2", sku: "GUAR-SER-30", productName: "Serum Phục Hồi B5 Hyaluronic", variantName: "30ml", quantity: 15, minThreshold: 20, location: "Kệ A2-05" },
      { id: "3", sku: "GUAR-CREAM-50", productName: "Kem dưỡng ẩm chuyên sâu Bio-Barrier", variantName: "50ml", quantity: 0, minThreshold: 10, location: "Kệ B1-01" },
    ];
  },
};
