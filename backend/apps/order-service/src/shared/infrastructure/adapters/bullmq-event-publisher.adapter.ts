import { Queue } from 'bullmq';
import {
  IOrderEventPublisherPort,
  OrderEventEnvelope,
} from '../../application/ports/order-event-publisher.port';

export class BullMqEventPublisherAdapter implements IOrderEventPublisherPort {
  public constructor(private readonly queue: Queue) {}

  public async publish(
    events: ReadonlyArray<OrderEventEnvelope>,
  ): Promise<void> {
    for (const event of events) {
      await this.queue.add(event.eventType, event, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: 1000,
        removeOnFail: 5000,
      });
    }
  }
}
