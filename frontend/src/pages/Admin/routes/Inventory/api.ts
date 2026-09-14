import api from "../../../../config/axios";
import type { InventoryBatch, InventoryItem } from "./type";

interface InventoryDto {
  id: string;
  variantId: string;
  quantity: number;
  minStock: number;
  isActive: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  batches: InventoryBatch[];
}

export interface ExpiringBatchDto {
  id: string;
  inventoryId: string;
  variantId: string;
  lotNumber: string;
  supplierId: string;
  quantity: number;
  expiredDate: string;
  updatedAt?: string | null;
}

export interface StockAdjustmentDto {
  id: string;
  batchId: string;
  variantId: string;
  adjustment: number;
  reason: string;
  note: string | null;
  createdBy: string;
  createdAt: string;
}

function mapInventory(d: InventoryDto): InventoryItem {
  return {
    id: d.id,
    variantId: d.variantId,
    quantity: d.quantity,
    minStock: d.minStock ?? 0,
    isActive: d.isActive ?? true,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
    batches: d.batches ?? [],
  };
}

export const inventoryApi = {
  async fetchInventory(): Promise<InventoryItem[]> {
    const { data } = await api.get<InventoryDto[]>("/inventories");
    return data.map(mapInventory);
  },

  async findByVariant(variantId: string): Promise<InventoryItem | null> {
    try {
      const { data } = await api.get<InventoryDto>(
        `/inventories/by-variant/${variantId}`,
      );
      return mapInventory(data);
    } catch {
      return null;
    }
  },

  async getById(id: string): Promise<InventoryItem> {
    const { data } = await api.get<InventoryDto>(`/inventories/${id}`);
    return mapInventory(data);
  },

  async createInventory(
    variantId: string,
    minStock: number,
  ): Promise<{ id: string; variantId: string }> {
    const { data } = await api.post<{ id: string; variantId: string }>(
      "/inventories",
      { variantId, minStock },
    );
    return data;
  },

  async addBatch(
    id: string,
    payload: { supplierId: string; quantity: number; expiredDate: string },
  ): Promise<{ id: string; lotNumber: string }> {
    const { data } = await api.post<{ id: string; lotNumber: string }>(
      `/inventories/${id}/batches`,
      payload,
    );
    return data;
  },

  async adjustBatch(
    id: string,
    batchId: string,
    adjustedQuantity: number,
  ): Promise<void> {
    await api.patch<void>(`/inventories/${id}/batches/${batchId}/adjust`, {
      adjustedQuantity,
    });
  },

  async updateMinStock(id: string, minStock: number): Promise<void> {
    await api.patch(`/inventories/${id}/min-stock`, { minStock });
  },

  async activateInventory(id: string): Promise<void> {
    await api.patch(`/inventories/${id}/activate`);
  },

  async deactivateInventory(id: string): Promise<void> {
    await api.patch(`/inventories/${id}/deactivate`);
  },

  async activateBatch(id: string, batchId: string): Promise<void> {
    await api.patch(`/inventories/${id}/batches/${batchId}/activate`);
  },

  async deactivateBatch(id: string, batchId: string): Promise<void> {
    await api.patch(`/inventories/${id}/batches/${batchId}/deactivate`);
  },

  async getExpiringBatches(days = 30): Promise<ExpiringBatchDto[]> {
    const { data } = await api.get<ExpiringBatchDto[]>("/inventories/expiring", {
      params: { days },
    });
    return data;
  },

  async createStockAdjustment(payload: {
    batchId: string;
    adjustment: number;
    reason: string;
    note?: string;
  }): Promise<{ id: string; batchId: string; variantId: string; quantity: number }> {
    const { data } = await api.post("/stock-adjustments", payload);
    return data;
  },

  async getStockAdjustments(query?: {
    batchId?: string;
    variantId?: string;
    reason?: string;
  }): Promise<StockAdjustmentDto[]> {
    const { data } = await api.get<StockAdjustmentDto[]>("/stock-adjustments", {
      params: query ?? {},
    });
    return data;
  },
};