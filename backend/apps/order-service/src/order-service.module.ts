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
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';
import { ORDERS_REPOSITORY } from './domain/repositories/orders.repository';
import { ORDER_TRANSACTIONS_REPOSITORY } from './domain/repositories/order-transactions.repository';
import { REMOVE_STOCK_PORT } from './domain/ports/remove-stock.port';
import { PUBLISH_ORDER_COMPLETED_PORT } from './domain/ports/publish-order-completed.port';
import { MikroOrdersRepository } from './infrastructure/repositories/mikro-orders.repository';
import { MikroOrderTransactionsRepository } from './infrastructure/repositories/mikro-order-transactions.repository';
import { RemoveStockAdapter } from './infrastructure/adapters/remove-stock.adapter';
import { OrderCompletedPublisherAdapter } from './infrastructure/adapters/order-completed-publisher.adapter';
import {
  CreateOrderUseCase,
  createOrderUseCaseFactory,
} from './application/use-cases/create-order/create-order.use-case';
import {
  FindAllOrdersUseCase,
  findAllOrdersUseCaseFactory,
} from './application/use-cases/find-all-orders/find-all-orders.use-case';
import {
  FindOrderByIdUseCase,
  findOrderByIdUseCaseFactory,
} from './application/use-cases/find-order-by-id/find-order-by-id.use-case';
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
  controllers: [OrdersController],
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
      provide: ORDERS_REPOSITORY,
      useClass: MikroOrdersRepository,
    },
    {
      provide: ORDER_TRANSACTIONS_REPOSITORY,
      useClass: MikroOrderTransactionsRepository,
    },
    {
      provide: CreateOrderUseCase,
      useFactory: createOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY],
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
      provide: UpdateOrderUseCase,
      useFactory: updateOrderUseCaseFactory,
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: CompleteOrderUseCase,
      useFactory: completeOrderUseCaseFactory,
      inject: [
        ORDERS_REPOSITORY,
        REMOVE_STOCK_PORT,
        ORDER_TRANSACTIONS_REPOSITORY,
        PUBLISH_ORDER_COMPLETED_PORT,
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
  ],
})
export class OrderServiceModule {}
