import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { RabbitmqModule, RabbitmqService } from '@app/rabbitmq';
import { Order } from './infrastructure/entities/order.entity';
import { OrderLine } from './infrastructure/entities/order-line.entity';
import { OrderTransaction } from './infrastructure/entities/order-transaction.entity';
import { OrdersController } from './presentation/public/orders/orders.controller';
import { ClientOrdersController } from './presentation/public/orders/client-orders.controller';
import { PosOrdersController } from './presentation/public/orders/pos-orders.controller';
import { BestSellersController } from './presentation/public/orders/best-sellers.controller';
import { InternalOrdersController } from './presentation/internal/orders/internal-orders.controller';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';
import { ORDERS_REPOSITORY } from './domain/repositories/orders.repository';
import { ORDER_TRANSACTIONS_REPOSITORY } from './domain/repositories/order-transactions.repository';
import { REMOVE_STOCK_PORT } from './domain/ports/remove-stock.port';
import { PUBLISH_ORDER_COMPLETED_PORT } from './domain/ports/publish-order-completed.port';
import { MikroOrdersRepository } from './infrastructure/repositories/mikro-orders.repository';
import { MikroOrderTransactionsRepository } from './infrastructure/repositories/mikro-order-transactions.repository';
import { RemoveStockAdapter } from './infrastructure/adapters/remove-stock.adapter';
import { OrderCompletedPublisherAdapter } from './infrastructure/adapters/order-completed-publisher.adapter';
import { VariantsReaderAdapter } from './infrastructure/adapters/variants-reader.adapter';
import { ReverseInventoryAdapter } from './infrastructure/adapters/reverse-inventory.adapter';
import { DecreaseCartLineQuantityAdapter } from './infrastructure/adapters/decrease-cart-line-quantity.adapter';
import { OrderLoggerAdapter } from './infrastructure/adapters/order-logger.adapter';
import { VariantLabelReaderAdapter } from './infrastructure/adapters/variant-label-reader.adapter';
import { EmployeeCodeReaderAdapter } from './infrastructure/adapters/employee-code-reader.adapter';
import { VARIANT_LABEL_READER_PORT } from './application/use-cases/print-order/ports/variant-label-reader.port';
import { EMPLOYEE_CODE_READER_PORT } from './application/use-cases/print-order/ports/employee-code-reader.port';
import {
  FindAllOrdersUseCase,
  findAllOrdersUseCaseFactory,
} from './application/use-cases/find-all-orders/find-all-orders.use-case';
import {
  FindOrderByIdUseCase,
  findOrderByIdUseCaseFactory,
} from './application/use-cases/find-order-by-id/find-order-by-id.use-case';
import {
  PrintOrderUseCase,
  printOrderUseCaseFactory,
} from './application/use-cases/print-order/print-order.use-case';
import {
  UpdateOrderUseCase,
  updateOrderUseCaseFactory,
} from './application/use-cases/update-order/update-order.use-case';
import {
  CompleteOrderUseCase,
  completeOrderUseCaseFactory,
} from './application/use-cases/complete-order/complete-order.use-case';
import {
  CancelOrderUseCase,
  cancelOrderUseCaseFactory,
} from './application/use-cases/cancel-order/cancel-order.use-case';
import {
  DeleteOrderUseCase,
  deleteOrderUseCaseFactory,
} from './application/use-cases/delete-order/delete-order.use-case';
import {
  FindOrderTransactionsUseCase,
  findOrderTransactionsUseCaseFactory,
} from './application/use-cases/find-order-transactions/find-order-transactions.use-case';
import {
  FindBestSellersUseCase,
  findBestSellersUseCaseFactory,
} from './application/use-cases/find-best-sellers/find-best-sellers.use-case';
import {
  FindVariantsInUseUseCase,
  findVariantsInUseUseCaseFactory,
} from './application/use-cases/find-variants-in-use/find-variants-in-use.use-case';
import {
  PlaceOrderUseCase,
  placeOrderUseCaseFactory,
} from './application/use-cases/place-order/place-order.use-case';
import {
  PosOrderUseCase,
  posOrderUseCaseFactory,
} from './application/use-cases/pos-order/pos-order.use-case';
import { VARIANT_READER_PORT } from './application/use-cases/place-order/ports/variants-reader.port';
import { REVERSE_INVENTORY_PORT } from './application/use-cases/place-order/ports/reverse-inventory.port';
import { DECREASE_CART_LINE_QUANTITY_PORT } from './application/use-cases/place-order/ports/decrease-cart-line-quantity.port';
import { ORDER_LOGGER_PORT } from './application/ports/employee-logger.port';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    RabbitmqModule,
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('ORDER_DB_HOST'),
        port: config.get<number>('ORDER_DB_PORT'),
        user: config.get<string>('ORDER_DB_USER'),
        password: config.get<string>('ORDER_DB_PASSWORD'),
        dbName: config.get<string>('ORDER_DB_NAME'),
        entities: [Order, OrderLine, OrderTransaction],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Order, OrderLine, OrderTransaction]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    BestSellersController,
    ClientOrdersController,
    PosOrdersController,
    OrdersController,
    InternalOrdersController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainErrorFilter,
    },
    {
      provide: REMOVE_STOCK_PORT,
      useFactory: (config: ConfigService) => new RemoveStockAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: PUBLISH_ORDER_COMPLETED_PORT,
      useFactory: (rabbitmq: RabbitmqService) =>
        new OrderCompletedPublisherAdapter(rabbitmq),
      inject: [RabbitmqService],
    },
    {
      provide: VARIANT_READER_PORT,
      useFactory: (config: ConfigService) => new VariantsReaderAdapter(config),
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
      provide: REVERSE_INVENTORY_PORT,
      useFactory: (config: ConfigService) =>
        new ReverseInventoryAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: DECREASE_CART_LINE_QUANTITY_PORT,
      useFactory: (config: ConfigService) =>
        new DecreaseCartLineQuantityAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: ORDER_LOGGER_PORT,
      useFactory: () => new OrderLoggerAdapter(),
    },
    {
      provide: ORDERS_REPOSITORY,
      useClass: MikroOrdersRepository,
    },
    {
      provide: ORDER_TRANSACTIONS_REPOSITORY,
      useClass: MikroOrderTransactionsRepository,
    },
    {
      provide: FindAllOrdersUseCase,
      useFactory: findAllOrdersUseCaseFactory,
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: FindOrderByIdUseCase,
      useFactory: findOrderByIdUseCaseFactory,
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: PrintOrderUseCase,
      useFactory: printOrderUseCaseFactory,
      inject: [
        ORDERS_REPOSITORY,
        VARIANT_LABEL_READER_PORT,
        EMPLOYEE_CODE_READER_PORT,
      ],
    },
    {
      provide: UpdateOrderUseCase,
      useFactory: updateOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: CompleteOrderUseCase,
      useFactory: completeOrderUseCaseFactory,
      inject: [
        ORDERS_REPOSITORY,
        ORDER_TRANSACTIONS_REPOSITORY,
        PUBLISH_ORDER_COMPLETED_PORT,
      ],
    },
    {
      provide: PlaceOrderUseCase,
      useFactory: placeOrderUseCaseFactory,
      inject: [
        ORDERS_REPOSITORY,
        VARIANT_READER_PORT,
        REMOVE_STOCK_PORT,
        REVERSE_INVENTORY_PORT,
        DECREASE_CART_LINE_QUANTITY_PORT,
        ORDER_LOGGER_PORT,
      ],
    },
    {
      provide: PosOrderUseCase,
      useFactory: posOrderUseCaseFactory,
      inject: [
        ORDERS_REPOSITORY,
        VARIANT_READER_PORT,
        REMOVE_STOCK_PORT,
        REVERSE_INVENTORY_PORT,
        ORDER_LOGGER_PORT,
      ],
    },
    {
      provide: CancelOrderUseCase,
      useFactory: cancelOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: DeleteOrderUseCase,
      useFactory: deleteOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: FindOrderTransactionsUseCase,
      useFactory: findOrderTransactionsUseCaseFactory,
      inject: [ORDER_TRANSACTIONS_REPOSITORY],
    },
    {
      provide: FindBestSellersUseCase,
      useFactory: findBestSellersUseCaseFactory,
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: FindVariantsInUseUseCase,
      useFactory: findVariantsInUseUseCaseFactory,
      inject: [ORDERS_REPOSITORY],
    },
  ],
})
export class OrderServiceModule {}
