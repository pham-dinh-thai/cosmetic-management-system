import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { PurchaseOrder } from './infrastructure/entities/purchase-order.entity';
import { PurchaseOrderLine } from './infrastructure/entities/purchase-order-line.entity';
import { PurchaseOrdersController } from './presentation/public/purchase-orders/purchase-orders.controller';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';
import { PURCHASE_ORDERS_REPOSITORY } from './domain/repositories/purchase-orders.repository';
import { ADD_STOCK_PORT } from './domain/ports/add-stock.port';
import { MikroPurchaseOrdersRepository } from './infrastructure/repositories/mikro-purchase-orders.repository';
import { AddStockAdapter } from './infrastructure/adapters/add-stock.adapter';
import {
  CreatePurchaseOrderUseCase,
  createPurchaseOrderUseCaseFactory,
} from './application/use-cases/create-purchase-order/create-purchase-order.use-case';
import {
  FindAllPurchaseOrdersUseCase,
  findAllPurchaseOrdersUseCaseFactory,
} from './application/use-cases/find-all-purchase-orders/find-all-purchase-orders.use-case';
import {
  FindPurchaseOrderByIdUseCase,
  findPurchaseOrderByIdUseCaseFactory,
} from './application/use-cases/find-purchase-order-by-id/find-purchase-order-by-id.use-case';
import {
  UpdatePurchaseOrderUseCase,
  updatePurchaseOrderUseCaseFactory,
} from './application/use-cases/update-purchase-order/update-purchase-order.use-case';
import {
  CompletePurchaseOrderUseCase,
  completePurchaseOrderUseCaseFactory,
} from './application/use-cases/complete-purchase-order/complete-purchase-order.use-case';
import {
  CancelPurchaseOrderUseCase,
  cancelPurchaseOrderUseCaseFactory,
} from './application/use-cases/cancel-purchase-order/cancel-purchase-order.use-case';
import {
  DeletePurchaseOrderUseCase,
  deletePurchaseOrderUseCaseFactory,
} from './application/use-cases/delete-purchase-order/delete-purchase-order.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('PURCHASE_DB_HOST'),
        port: config.get<number>('PURCHASE_DB_PORT'),
        user: config.get<string>('PURCHASE_DB_USER'),
        password: config.get<string>('PURCHASE_DB_PASSWORD'),
        dbName: config.get<string>('PURCHASE_DB_NAME'),
        entities: [PurchaseOrder, PurchaseOrderLine],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([PurchaseOrder, PurchaseOrderLine]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [PurchaseOrdersController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainErrorFilter,
    },
    {
      provide: ADD_STOCK_PORT,
      useFactory: (config: ConfigService) => new AddStockAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: PURCHASE_ORDERS_REPOSITORY,
      useClass: MikroPurchaseOrdersRepository,
    },
    {
      provide: CreatePurchaseOrderUseCase,
      useFactory: createPurchaseOrderUseCaseFactory,
      inject: [PURCHASE_ORDERS_REPOSITORY],
    },
    {
      provide: FindAllPurchaseOrdersUseCase,
      useFactory: findAllPurchaseOrdersUseCaseFactory,
      inject: [PURCHASE_ORDERS_REPOSITORY],
    },
    {
      provide: FindPurchaseOrderByIdUseCase,
      useFactory: findPurchaseOrderByIdUseCaseFactory,
      inject: [PURCHASE_ORDERS_REPOSITORY],
    },
    {
      provide: UpdatePurchaseOrderUseCase,
      useFactory: updatePurchaseOrderUseCaseFactory,
      inject: [PURCHASE_ORDERS_REPOSITORY],
    },
    {
      provide: CompletePurchaseOrderUseCase,
      useFactory: completePurchaseOrderUseCaseFactory,
      inject: [PURCHASE_ORDERS_REPOSITORY, ADD_STOCK_PORT],
    },
    {
      provide: CancelPurchaseOrderUseCase,
      useFactory: cancelPurchaseOrderUseCaseFactory,
      inject: [PURCHASE_ORDERS_REPOSITORY],
    },
    {
      provide: DeletePurchaseOrderUseCase,
      useFactory: deletePurchaseOrderUseCaseFactory,
      inject: [PURCHASE_ORDERS_REPOSITORY],
    },
  ],
})
export class PurchaseServiceModule {}
