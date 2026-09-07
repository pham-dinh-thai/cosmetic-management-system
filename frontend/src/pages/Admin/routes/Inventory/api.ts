import api from "../../../../config/axios";
import type { InventoryItem } from "./type";

interface InventoryDto {
  id: string;
  variantId: string;
  quantity: number;
  minStock: number;
  expiryDate: string | null;
  lastUpdatedAt: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export const inventoryApi = {
  async fetchInventory(): Promise<InventoryItem[]> {
    const { data } = await api.get<InventoryDto[]>("/inventory");
    return data.map((d) => ({
      id: d.id,
      variantId: d.variantId,
      quantity: d.quantity,
      minStock: d.minStock ?? 0,
      expiryDate: d.expiryDate,
      lastUpdatedAt: d.lastUpdatedAt,
    }));
  },

  async findByVariant(variantId: string): Promise<InventoryItem | null> {
    try {
      const { data } = await api.get<InventoryDto>(`/inventory/by-variant/${variantId}`);
      return {
        id: data.id,
        variantId: data.variantId,
        quantity: data.quantity,
        minStock: data.minStock ?? 0,
        expiryDate: data.expiryDate,
        lastUpdatedAt: data.lastUpdatedAt,
      };
    } catch {
      return null;
    }
  },

  async getById(id: string): Promise<InventoryItem> {
    const { data } = await api.get<InventoryDto>(`/inventory/${id}`);
    return {
      id: data.id,
      variantId: data.variantId,
      quantity: data.quantity,
      minStock: data.minStock ?? 0,
      expiryDate: data.expiryDate,
      lastUpdatedAt: data.lastUpdatedAt,
    };
  },

  async adjustInventory(id: string, adjustment: number): Promise<void> {
    await api.patch(`/inventory/${id}/adjust`, { adjustment });
  },

  async adjustInventoryWithReason(
    variantId: string,
    adjustment: number,
    reason: string,
    note?: string,
    minStock?: number,
  ): Promise<void> {
    await api.post("/inventory/adjustments", {
      variantId,
      adjustment,
      reason,
      note,
      minStock,
    });
  },

  async updateMinStock(id: string, minStock: number): Promise<void> {
    await api.patch(`/inventory/${id}/min-stock`, { minStock });
  },

  async deleteInventory(id: string): Promise<void> {
    await api.delete(`/inventory/${id}`);
  },
};