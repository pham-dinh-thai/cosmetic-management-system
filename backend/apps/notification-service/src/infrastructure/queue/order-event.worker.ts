import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job, Worker } from 'bullmq';
import { SendOrderEventMailUseCase } from '../../application/use-cases/send-order-event-mail/send-order-event-mail.use-case';
import { OrderEventEnvelope } from '../../domain/order-event';
import { ORDER_EVENTS_QUEUE } from './order-events.queue';

@Injectable()
export class OrderEventWorker implements OnApplicationShutdown {
  private readonly logger = new Logger(OrderEventWorker.name);
  private readonly worker: Worker<OrderEventEnvelope>;

  public constructor(
    config: ConfigService,
    private readonly sendOrderEventMail: SendOrderEventMailUseCase,
  ) {
    this.worker = new Worker<OrderEventEnvelope>(
      ORDER_EVENTS_QUEUE,
      async (job: Job<OrderEventEnvelope>) => {
        this.logger.log(
          `Nhan job ${job.name} (${job.data.eventType}) cho don ${job.data.payload.orderId}`,
        );

        await this.sendOrderEventMail.execute(job.data);
      },
      {
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: Number(config.get<string>('REDIS_PORT', '6379')),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
        },
      },
    );

    this.worker.on('failed', (job, error) => {
      this.logger.error(
        `Job ${job?.name ?? '?'} that bai sau ${job?.attemptsMade ?? 0} lan: ${error.message}`,
      );
    });
  }

  public async onApplicationShutdown(): Promise<void> {
    await this.worker.close();
  }
}
