export interface CreateOrderLineRequest {
  variantId: string;
  quantity: number;
}

export interface IPlaceOrderRequest {
  customerId: string;
  lines: CreateOrderLineRequest[];
}
