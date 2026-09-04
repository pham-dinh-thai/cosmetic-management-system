export { RabbitmqModule } from './rabbitmq.module';
export { RabbitmqService } from './rabbitmq.service';
export {
  EVENTS_EXCHANGE,
  ORDER_COMPLETED_ROUTING_KEY,
  INVOICE_ORDER_QUEUE,
} from './constants';
export type { OrderCompletedEvent } from './events';
