import api from "../../../../config/axios";
import type { InventoryItem } from "./type";

interface InventoryDto {
  id: string;
  variantId: string;
  quantity: number;
  minStock: number;
  expiryDate: string | null;
  lastUpdatedAt: string;
  isActive?: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: string | null;
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
      isActive: d.isActive ?? true,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
      createdBy: d.createdBy,
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
        isActive: data.isActive ?? true,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        createdBy: data.createdBy,
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
      isActive: data.isActive ?? true,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
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

  async activateInventory(id: string): Promise<void> {
    await api.patch(`/inventory/${id}/activate`);
  },

  async deactivateInventory(id: string): Promise<void> {
    await api.patch(`/inventory/${id}/deactivate`);
  },
};