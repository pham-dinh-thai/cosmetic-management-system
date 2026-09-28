import { OrderPaymentMethod } from '../../../../shared/domain/enums/order-payment-method.enum';

export interface CreateOrderLineRequest {
  variantId: string;
  quantity: number;
}

export interface IPlaceOrderRequest {
  customerId?: string | null;
  lines: CreateOrderLineRequest[];
  paymentMethod?: OrderPaymentMethod;
  recipientName?: string | null;
  recipientPhone?: string | null;
  shippingAddress?: string | null;
  shippingCity?: string | null;
}

export type OrderChannel = 'WEB' | 'POS';
