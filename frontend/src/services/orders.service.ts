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
  total: number;
  paymentMethod: PaymentMethod;
}

export const ordersService = {
  async createOrder(payload: CreatePosOrderPayload): Promise<PosOrderResponse> {
    const { data } = await api.post<PosOrderResponse>("/orders/pos", payload);
    return data;
  },
};