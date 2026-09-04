export type OrderCompletedEvent = {
  event: 'order.completed';
  orderId: string;
  code: string;
  customerId: string;
  totalAmount: number;
  occurredAt: string;
};
