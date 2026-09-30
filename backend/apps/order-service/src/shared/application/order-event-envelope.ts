import {
  OrderEventEnvelope,
  OrderEventPayload,
} from './ports/order-event-publisher.port';
import { Order } from '../domain/order.aggregate';

const toPayload = (
  order: Order,
  event: { customerId: string; createdAt: Date },
): OrderEventPayload => ({
  orderId: order.getId(),
  customerId: event.customerId,
  code: order.getCode(),
  totalAmount: order.getTotalAmount(),
  paymentStatus: order.getPaymentStatus(),
  recipientName: order.getRecipientName(),
  occurredAt: event.createdAt.toISOString(),
});

export const pullOrderEventEnvelopes = (order: Order): OrderEventEnvelope[] =>
  order.pullDomainEvents().map((event) => ({
    eventType: event.eventType,
    payload: toPayload(order, event),
  }));
