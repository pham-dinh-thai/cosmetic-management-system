import { Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { EVENT_PUBLISHER_PORT } from '../../application/ports/order-event-publisher.port';
import { BullMqEventPublisherAdapter } from '../adapters/bullmq-event-publisher.adapter';
import { ORDER_EVENTS_QUEUE } from './order-events.queue';

@Module({
  providers: [
    {
      provide: Queue,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Queue =>
        new Queue(ORDER_EVENTS_QUEUE, {
          connection: {
            host: config.get<string>('REDIS_HOST', 'localhost'),
            port: Number(config.get<string>('REDIS_PORT', '6379')),
            password: config.get<string>('REDIS_PASSWORD') || undefined,
          },
        }),
    },
    {
      provide: EVENT_PUBLISHER_PORT,
      inject: [Queue],
      useFactory: (queue: Queue) => new BullMqEventPublisherAdapter(queue),
    },
  ],
  exports: [EVENT_PUBLISHER_PORT],
})
export class OrderEventPublisherModule implements OnApplicationShutdown {
  public constructor(private readonly queue: Queue) {}

  public async onApplicationShutdown(): Promise<void> {
    await this.queue.close();
  }
}
