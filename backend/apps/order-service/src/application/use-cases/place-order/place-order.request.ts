import { OrderPaymentMethod } from 'apps/order-service/src/domain/types';

export interface CreateOrderLineRequest {
  variantId: string;
  quantity: number;
}

export interface IPlaceOrderRequest {
  customerId: string;
  lines: CreateOrderLineRequest[];
  paymentMethod?: OrderPaymentMethod;
  recipientName?: string | null;
  recipientPhone?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
}
