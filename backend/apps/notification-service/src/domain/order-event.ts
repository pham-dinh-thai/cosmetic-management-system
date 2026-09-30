export type OrderEventPayload = {
  orderId: string;
  customerId: string;
  code: string;
  totalAmount: number;
  paymentStatus: string;
  recipientName: string | null;
  occurredAt: string;
};

export type OrderEventEnvelope = {
  eventType: string;
  payload: OrderEventPayload;
};
