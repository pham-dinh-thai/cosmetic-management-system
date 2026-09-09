import api from "../config/axios";

export interface PurchaseOrderLineDto {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PurchaseOrderDto {
  id: string;
  code: string;
  supplierId: string;
  status: string;
  totalAmount: number;
  lines: PurchaseOrderLineDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseOrderPayload {
  supplierId: string;
  lines: { variantId: string; quantity: number; unitPrice: number }[];
}

export const purchaseOrdersService = {
  async getPurchaseOrders(search?: string, status?: string): Promise<PurchaseOrderDto[]> {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (status) params.status = status;
    const { data } = await api.get<PurchaseOrderDto[]>("/purchase-orders", {
      params: Object.keys(params).length ? params : undefined,
    });
    return data;
  },

  async getPurchaseOrderById(id: string): Promise<PurchaseOrderDto> {
    const { data } = await api.get<PurchaseOrderDto>(`/purchase-orders/${id}`);
    return data;
  },

  async createPurchaseOrder(
    payload: CreatePurchaseOrderPayload,
  ): Promise<{ id: string }> {
    const { data } = await api.post<{ id: string }>("/purchase-orders", payload);
    return data;
  },

  async updatePurchaseOrder(
    id: string,
    payload: CreatePurchaseOrderPayload,
  ): Promise<void> {
    await api.put<void>(`/purchase-orders/${id}`, payload);
  },

  async deletePurchaseOrder(id: string): Promise<void> {
    await api.delete<void>(`/purchase-orders/${id}`);
  },

  async completePurchaseOrder(id: string): Promise<{ id: string }> {
    const { data } = await api.patch<{ id: string }>(`/purchase-orders/${id}/complete`);
    return data;
  },

  async cancelPurchaseOrder(id: string): Promise<void> {
    await api.patch<void>(`/purchase-orders/${id}/cancel`);
  },

  async printPurchaseOrder(id: string): Promise<Blob> {
    const { data } = await api.get<Blob>(`/purchase-orders/${id}/print`, {
      responseType: "blob",
    });
    return data;
  },
};

export async function openPurchaseReceiptPrint(id: string): Promise<void> {
  try {
    const blob = await purchaseOrdersService.printPurchaseOrder(id);
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (error) {
    console.error(error);
    alert("Không thể in phiếu nhập");
  }
}