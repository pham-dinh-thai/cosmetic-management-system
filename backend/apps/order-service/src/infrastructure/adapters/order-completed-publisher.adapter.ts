import { RabbitmqService } from '@app/rabbitmq';
import {
  EVENTS_EXCHANGE,
  ORDER_COMPLETED_ROUTING_KEY,
  OrderCompletedEvent,
} from '@app/rabbitmq';
import { IPublishOrderCompletedPort } from '../../domain/ports/publish-order-completed.port';

export class OrderCompletedPublisherAdapter implements IPublishOrderCompletedPort {
  public constructor(private readonly rabbitmq: RabbitmqService) {}

  public async execute(event: OrderCompletedEvent): Promise<void> {
    await this.rabbitmq.publish(
      EVENTS_EXCHANGE,
      ORDER_COMPLETED_ROUTING_KEY,
      event,
    );
  }
}
