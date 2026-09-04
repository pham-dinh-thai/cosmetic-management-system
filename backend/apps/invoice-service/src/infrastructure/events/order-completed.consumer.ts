import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitmqService } from '@app/rabbitmq';
import {
  EVENTS_EXCHANGE,
  INVOICE_ORDER_QUEUE,
  ORDER_COMPLETED_ROUTING_KEY,
  OrderCompletedEvent,
} from '@app/rabbitmq';
import { CreateInvoiceFromOrderUseCase } from '../../application/use-cases/create-invoice-from-order/create-invoice-from-order.use-case';

@Injectable()
export class OrderCompletedConsumer implements OnModuleInit {
  private readonly logger = new Logger(OrderCompletedConsumer.name);

  public constructor(
    private readonly rabbitmq: RabbitmqService,
    private readonly createInvoiceFromOrderUseCase: CreateInvoiceFromOrderUseCase,
  ) {}

  public async onModuleInit(): Promise<void> {
    await this.rabbitmq.subscribe({
      exchange: EVENTS_EXCHANGE,
      queue: INVOICE_ORDER_QUEUE,
      routingKeys: [ORDER_COMPLETED_ROUTING_KEY],
      handler: async (message) => {
        const event = message as unknown as OrderCompletedEvent;
        const result = await this.createInvoiceFromOrderUseCase.execute(event);

        if (result) {
          this.logger.log(
            `Created invoice ${result.id} for completed order ${event.orderId}`,
          );
        } else {
          this.logger.log(
            `Skipped order ${event.orderId}: invoice already exists`,
          );
        }
      },
    });
  }
}
