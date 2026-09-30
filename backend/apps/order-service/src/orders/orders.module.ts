import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Redis } from 'ioredis';
import { RedisClientModule, REDIS_CLIENT } from '@app/redis-client';
import { Order } from '../shared/infrastructure/entities/order.entity';
import { OrderLine } from '../shared/infrastructure/entities/order-line.entity';
import { OrdersController } from './presentation/public/orders/orders.controller';
import { InternalOrdersController } from './presentation/internal/orders/internal-orders.controller';
import { EVENT_PUBLISHER_PORT } from '../shared/application/ports/order-event-publisher.port';
import { OrderEventPublisherModule } from '../shared/infrastructure/queue/order-event-publisher.module';
import { ORDERS_REPOSITORY } from './domain/repositories/orders.repository';
import { ORDER_TRANSACTIONS_REPOSITORY } from '../order-transactions/domain/repositories/order-transactions.repository';
import { OrderTransactionsModule } from '../order-transactions/order-transactions.module';
import { MikroOrdersRepository } from './infrastructure/repositories/mikro-orders.repository';
import { CustomerNameReaderAdapter } from './infrastructure/adapters/customer-name-reader.adapter';
import { CreateInvoiceAdapter } from './infrastructure/adapters/create-invoice.adapter';
import { RestoreStockAdapter } from './infrastructure/adapters/restore-stock.adapter';
import { FinalizeInvoiceAdapter } from './infrastructure/adapters/finalize-invoice.adapter';
import { VariantLabelReaderAdapter } from './infrastructure/adapters/variant-label-reader.adapter';
import { EmployeeCodeReaderAdapter } from './infrastructure/adapters/employee-code-reader.adapter';
import { CUSTOMER_NAME_READER_PORT } from './application/ports/customer-name-reader.port';
import { CREATE_INVOICE_PORT } from './application/ports/create-invoice.port';
import { RESTORE_STOCK_PORT } from './application/ports/restore-stock.port';
import { FINALIZE_INVOICE_PORT } from './application/ports/finalize-invoice.port';
import { VARIANT_LABEL_READER_PORT } from './application/ports/variant-label-reader.port';
import { EMPLOYEE_CODE_READER_PORT } from './application/ports/employee-code-reader.port';
import {
  findAllOrdersUseCaseFactory,
  FindAllOrdersUseCase,
} from './application/use-cases/find-all-orders/find-all-orders.use-case';
import {
  ViewOrderDetailUseCase,
  viewOrderDetailUseCaseFactory,
} from './application/use-cases/view-order-detail/view-order-detail.use-case';
import {
  ConfirmOrderUseCase,
  confirmOrderUseCaseFactory,
} from './application/use-cases/confirm-order/confirm-order.use-case';
import {
  PrepareOrderUseCase,
  prepareOrderUseCaseFactory,
} from './application/use-cases/prepare-order/prepare-order.use-case';
import {
  ShipOrderUseCase,
  shipOrderUseCaseFactory,
} from './application/use-cases/ship-order/ship-order.use-case';
import {
  DeliverOrderUseCase,
  deliverOrderUseCaseFactory,
} from './application/use-cases/deliver-order/deliver-order.use-case';
import {
  CompleteOrderUseCase,
  completeOrderUseCaseFactory,
} from './application/use-cases/complete-order/complete-order.use-case';
import {
  CancelOrderUseCase,
  cancelOrderUseCaseFactory,
} from './application/use-cases/cancel-order/cancel-order.use-case';
import {
  DeliveryFailedOrderUseCase,
  deliveryFailedOrderUseCaseFactory,
} from './application/use-cases/delivery-failed-order/delivery-failed-order.use-case';
import {
  ReturnOrderUseCase,
  returnOrderUseCaseFactory,
} from './application/use-cases/return-order/return-order.use-case';
import {
  RefundOrderUseCase,
  refundOrderUseCaseFactory,
} from './application/use-cases/refund-order/refund-order.use-case';
import {
  PrintOrderUseCase,
  printOrderUseCaseFactory,
} from './application/use-cases/print-order/print-order.use-case';
import {
  UpdateOrderUseCase,
  updateOrderUseCaseFactory,
} from './application/use-cases/update-order/update-order.use-case';
import {
  UpdateOrderPaymentStatusUseCase,
  updateOrderPaymentStatusUseCaseFactory,
} from './application/use-cases/update-order-payment-status/update-order-payment-status.use-case';
import {
  DeleteOrderUseCase,
  deleteOrderUseCaseFactory,
} from './application/use-cases/delete-order/delete-order.use-case';
import {
  FindVariantsInUseUseCase,
  findVariantsInUseUseCaseFactory,
} from './application/use-cases/find-variants-in-use/find-variants-in-use.use-case';

@Module({
  imports: [
    OrderEventPublisherModule,
    OrderTransactionsModule,
    RedisClientModule,
    MikroOrmModule.forFeature([Order, OrderLine]),
  ],
  controllers: [OrdersController, InternalOrdersController],
  providers: [
    {
      provide: ORDERS_REPOSITORY,
      useClass: MikroOrdersRepository,
    },
    {
      provide: CUSTOMER_NAME_READER_PORT,
      useFactory: (config: ConfigService, redis: Redis) =>
        new CustomerNameReaderAdapter(config, redis),
      inject: [ConfigService, REDIS_CLIENT],
    },
    {
      provide: CREATE_INVOICE_PORT,
      useFactory: (config: ConfigService) => new CreateInvoiceAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: FINALIZE_INVOICE_PORT,
      useFactory: (config: ConfigService) => new FinalizeInvoiceAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: RESTORE_STOCK_PORT,
      useFactory: (config: ConfigService) => new RestoreStockAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: VARIANT_LABEL_READER_PORT,
      useFactory: (config: ConfigService) =>
        new VariantLabelReaderAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: EMPLOYEE_CODE_READER_PORT,
      useFactory: (config: ConfigService) =>
        new EmployeeCodeReaderAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: FindAllOrdersUseCase,
      useFactory: findAllOrdersUseCaseFactory,
      inject: [ORDERS_REPOSITORY, CUSTOMER_NAME_READER_PORT],
    },
    {
      provide: ViewOrderDetailUseCase,
      useFactory: viewOrderDetailUseCaseFactory,
      inject: [ORDERS_REPOSITORY, CUSTOMER_NAME_READER_PORT],
    },
    {
      provide: ConfirmOrderUseCase,
      useFactory: confirmOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY, CREATE_INVOICE_PORT, EVENT_PUBLISHER_PORT],
    },
    {
      provide: PrepareOrderUseCase,
      useFactory: prepareOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY, EVENT_PUBLISHER_PORT],
    },
    {
      provide: ShipOrderUseCase,
      useFactory: shipOrderUseCaseFactory,
      inject: [
        ORDERS_REPOSITORY,
        ORDER_TRANSACTIONS_REPOSITORY,
        EVENT_PUBLISHER_PORT,
      ],
    },
    {
      provide: DeliverOrderUseCase,
      useFactory: deliverOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY, EVENT_PUBLISHER_PORT],
    },
    {
      provide: CompleteOrderUseCase,
      useFactory: completeOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY, FINALIZE_INVOICE_PORT, EVENT_PUBLISHER_PORT],
    },
    {
      provide: CancelOrderUseCase,
      useFactory: cancelOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY, RESTORE_STOCK_PORT, EVENT_PUBLISHER_PORT],
    },
    {
      provide: DeliveryFailedOrderUseCase,
      useFactory: deliveryFailedOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY, EVENT_PUBLISHER_PORT],
    },
    {
      provide: ReturnOrderUseCase,
      useFactory: returnOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY, RESTORE_STOCK_PORT, EVENT_PUBLISHER_PORT],
    },
    {
      provide: RefundOrderUseCase,
      useFactory: refundOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY, EVENT_PUBLISHER_PORT],
    },
    {
      provide: PrintOrderUseCase,
      useFactory: printOrderUseCaseFactory,
      inject: [
        ORDERS_REPOSITORY,
        VARIANT_LABEL_READER_PORT,
        EMPLOYEE_CODE_READER_PORT,
        CUSTOMER_NAME_READER_PORT,
      ],
    },
    {
      provide: UpdateOrderUseCase,
      useFactory: updateOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: UpdateOrderPaymentStatusUseCase,
      useFactory: updateOrderPaymentStatusUseCaseFactory,
      inject: [ORDERS_REPOSITORY, EVENT_PUBLISHER_PORT],
    },
    {
      provide: DeleteOrderUseCase,
      useFactory: deleteOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: FindVariantsInUseUseCase,
      useFactory: findVariantsInUseUseCaseFactory,
      inject: [ORDERS_REPOSITORY],
    },
  ],
})
export class OrdersModule {}
