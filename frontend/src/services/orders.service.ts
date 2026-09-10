import api from "../config/axios";

export interface PosOrderItem {
  cosmeticId: string;
  variantId: string;
  quantity: number;
  unitPrice?: number;
  productName?: string;
  variantName?: string;
  imageUrl?: string | null;
}

export type PaymentMethod = "CASH" | "BANK_TRANSFER" | "CARD";

export interface CreatePosOrderPayload {
  customerId?: string | null;
  items: { variantId: string; quantity: number }[];
  paymentMethod: PaymentMethod;
}

export interface PosOrderResponse {
  id: string;
  status?: string;
  total: number;
  paymentMethod: PaymentMethod;
}

export interface BestSellerItem {
  variantId: string;
  quantitySold: number;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'COMPLETED' | 'CANCELLED';

export interface OrderReadModel {
  id: string;
  code: string;
  customerId: string | null;
  customerName: string | null;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderDetailLine {
  id: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderDetailReadModel {
  id: string;
  code: string;
  customerId: string;
  status: OrderStatus;
  totalAmount: number;
  lines: OrderDetailLine[];
  createdAt: string;
  updatedAt: string;
}

export const ordersService = {
  async createOrder(payload: CreatePosOrderPayload): Promise<PosOrderResponse> {
    const { data } = await api.post<PosOrderResponse>("/orders/pos", payload);
    return data;
  },

  async getBestSellers(limit = 4): Promise<BestSellerItem[]> {
    const { data } = await api.get<BestSellerItem[]>("/orders/best-sellers", {
      params: { limit },
    });
    return data;
  },

  async getOrders(params?: { search?: string; status?: OrderStatus; customerId?: string }): Promise<OrderReadModel[]> {
    const { data } = await api.get<OrderReadModel[]>('/orders', { params });
    return data;
  },

  async getOrderById(id: string): Promise<OrderDetailReadModel> {
    // Avoid a browser/proxy 304 response without a response body when the
    // detail is requested for printing.
    const { data } = await api.get<OrderDetailReadModel>(`/orders/${id}`, {
      params: { _t: Date.now() },
      headers: { 'Cache-Control': 'no-cache' },
    });
    return data;
  },

  async completeOrder(id: string): Promise<void> {
    await api.patch(`/orders/${id}/complete`);
  },

  async cancelOrder(id: string): Promise<void> {
    await api.patch(`/orders/${id}/cancel`);
  },

  async deleteOrder(id: string): Promise<void> {
    await api.delete(`/orders/${id}`);
  },

  async printOrder(id: string): Promise<Blob> {
    const { data } = await api.get<Blob>(`/orders/${id}/print`, {
      responseType: "blob",
    });
    return data;
  },
};

export async function openOrderReceiptPrint(id: string): Promise<void> {
  try {
    const blob = await ordersService.printOrder(id);
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (error) {
    console.error(error);
    alert("Không thể in hóa đơn");
  }
}
