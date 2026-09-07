export type PosOrderPaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CARD';

export type PosOrderItem = {
  variantId: string;
  quantity: number;
};

export type IPosOrderRequest = {
  customerId?: string | null;
  items: PosOrderItem[];
  paymentMethod: PosOrderPaymentMethod;
};