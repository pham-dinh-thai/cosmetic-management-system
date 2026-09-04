import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { Channel, ChannelModel, ConsumeMessage } from 'amqplib';

@Injectable()
export class RabbitmqService implements OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqService.name);
  private model: ChannelModel | null = null;
  private channel: Channel | null = null;
  private connecting: Promise<Channel> | null = null;

  public constructor(private readonly config: ConfigService) {}

  private get url(): string {
    return this.config.get<string>('RABBITMQ_URL') ?? 'amqp://localhost:5672';
  }

  private async connect(): Promise<Channel> {
    if (this.channel) {
      return this.channel;
    }

    if (this.connecting) {
      return this.connecting;
    }

    this.connecting = (async () => {
      try {
        this.logger.log(`Connecting to RabbitMQ at ${this.url}`);
        this.model = await amqp.connect(this.url);
        this.channel = await this.model.createChannel();

        this.model.on('close', () => {
          this.logger.warn('RabbitMQ connection closed');
          this.model = null;
          this.channel = null;
          this.connecting = null;
        });

        this.channel.on('error', (error) => {
          this.logger.error(`RabbitMQ channel error: ${error.message}`);
        });

        return this.channel;
      } catch (error) {
        this.connecting = null;
        throw error;
      }
    })();

    return this.connecting;
  }

  public async publish<T>(
    exchange: string,
    routingKey: string,
    payload: T,
  ): Promise<void> {
    const channel = await this.connect();
    await channel.assertExchange(exchange, 'topic', { durable: true });
    channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      { persistent: true },
    );
  }

  public async subscribe(options: {
    exchange: string;
    queue: string;
    routingKeys: string[];
    handler: (message: Record<string, unknown>) => void | Promise<void>;
  }): Promise<void> {
    const { exchange, queue, routingKeys, handler } = options;
    const channel = await this.connect();

    await channel.assertExchange(exchange, 'topic', { durable: true });
    await channel.assertQueue(queue, { durable: true });

    for (const routingKey of routingKeys) {
      await channel.bindQueue(queue, exchange, routingKey);
    }

    await channel.consume(queue, (raw: ConsumeMessage | null) => {
      if (!raw) {
        return;
      }

      void (async () => {
        try {
          const message = JSON.parse(raw.content.toString('utf-8')) as Record<
            string,
            unknown
          >;
          await handler(message);
          channel.ack(raw);
        } catch (error) {
          this.logger.error(
            `Failed to process message: ${(error as Error).message}`,
          );
          channel.nack(raw, false, false);
        }
      })();
    });

    this.logger.log(
      `Subscribed to ${queue} on ${exchange} (${routingKeys.join(', ')})`,
    );
  }

  public async onModuleDestroy(): Promise<void> {
    try {
      await this.channel?.close();
      await this.model?.close();
    } catch {
      // ignore shutdown errors
    }
    this.channel = null;
    this.model = null;
    this.connecting = null;
  }
}
