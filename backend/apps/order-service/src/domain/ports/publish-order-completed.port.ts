import { OrderCompletedEvent } from '@app/rabbitmq';

export interface IPublishOrderCompletedPort {
  execute(event: OrderCompletedEvent): Promise<void>;
}

export const PUBLISH_ORDER_COMPLETED_PORT = 'IPublishOrderCompletedPort';
