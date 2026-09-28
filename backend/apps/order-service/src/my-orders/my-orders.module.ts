import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Redis } from 'ioredis';
import { RedisClientModule, REDIS_CLIENT } from '@app/redis-client';
import { Order } from '../shared/infrastructure/entities/order.entity';
import { OrderLine } from '../shared/infrastructure/entities/order-line.entity';
import { OrderTransaction } from '../shared/infrastructure/entities/order-transaction.entity';
import { MyOrdersController } from './presentation/public/orders/my-orders.controller';
import { ClientOrdersController } from './presentation/public/orders/client-orders.controller';
import { PosOrdersController } from './presentation/public/orders/pos-orders.controller';
import { MY_ORDERS_REPOSITORY } from './domain/repositories/my-orders.repository';
import { MikroMyOrdersRepository } from './infrastructure/repositories/mikro-my-orders.repository';
import { VARIANT_READER_PORT } from './application/ports/variants-reader.port';
import { REMOVE_STOCK_PORT } from './application/ports/remove-stock.port';
import { REVERSE_INVENTORY_PORT } from './application/ports/reverse-inventory.port';
import { DECREASE_CART_LINE_QUANTITY_PORT } from './application/ports/decrease-cart-line-quantity.port';
import { ORDER_LOGGER_PORT } from './application/ports/order-logger.port';
import { CREATE_INVOICE_PORT } from './application/ports/create-invoice.port';
import { FINALIZE_INVOICE_PORT } from './application/ports/finalize-invoice.port';
import { RESTORE_STOCK_PORT } from './application/ports/restore-stock.port';
import { CUSTOMER_ID_READER_PORT } from './application/ports/customer-id-reader.port';
import { MY_ORDERS_CUSTOMER_NAME_READER_PORT } from './application/ports/customer-name-reader.port';
import { VARIANT_LABEL_READER_PORT } from './application/ports/variant-label-reader.port';
import { VariantsReaderAdapter } from './infrastructure/adapters/variants-reader.adapter';
import { RemoveStockAdapter } from './infrastructure/adapters/remove-stock.adapter';
import { ReverseInventoryAdapter } from './infrastructure/adapters/reverse-inventory.adapter';
import { DecreaseCartLineQuantityAdapter } from './infrastructure/adapters/decrease-cart-line-quantity.adapter';
import { OrderLoggerAdapter } from './infrastructure/adapters/order-logger.adapter';
import { CreateInvoiceAdapter } from './infrastructure/adapters/create-invoice.adapter';
import { FinalizeInvoiceAdapter } from './infrastructure/adapters/finalize-invoice.adapter';
import { RestoreStockAdapter } from './infrastructure/adapters/restore-stock.adapter';
import { CustomerIdReaderAdapter } from './infrastructure/adapters/customer-id-reader.adapter';
import { CustomerNameReaderAdapter } from './infrastructure/adapters/customer-name-reader.adapter';
import { VariantLabelReaderAdapter } from './infrastructure/adapters/variant-label-reader.adapter';
import {
  placeOrderUseCaseFactory,
  PlaceOrderUseCase,
} from './application/use-cases/place-order/place-order.use-case';
import {
  findMyOrdersUseCaseFactory,
  FindMyOrdersUseCase,
} from './application/use-cases/find-my-orders/find-my-orders.use-case';
import {
  viewMyOrderUseCaseFactory,
  ViewMyOrderUseCase,
} from './application/use-cases/view-my-order/view-my-order.use-case';
import {
  cancelMyOrderUseCaseFactory,
  CancelMyOrderUseCase,
} from './application/use-cases/cancel-my-order/cancel-my-order.use-case';

@Module({
  imports: [
    RedisClientModule,
    MikroOrmModule.forFeature([Order, OrderLine, OrderTransaction]),
  ],
  controllers: [
    MyOrdersController,
    ClientOrdersController,
    PosOrdersController,
  ],
  providers: [
    {
      provide: MY_ORDERS_REPOSITORY,
      useClass: MikroMyOrdersRepository,
    },
    {
      provide: VARIANT_READER_PORT,
      useFactory: (config: ConfigService) => new VariantsReaderAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: REMOVE_STOCK_PORT,
      useFactory: (config: ConfigService) => new RemoveStockAdapter(config),
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
      provide: CUSTOMER_ID_READER_PORT,
      useFactory: (config: ConfigService) =>
        new CustomerIdReaderAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: MY_ORDERS_CUSTOMER_NAME_READER_PORT,
      useFactory: (config: ConfigService, redis: Redis) =>
        new CustomerNameReaderAdapter(config, redis),
      inject: [ConfigService, REDIS_CLIENT],
    },
    {
      provide: VARIANT_LABEL_READER_PORT,
      useFactory: (config: ConfigService) =>
        new VariantLabelReaderAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: PlaceOrderUseCase,
      useFactory: placeOrderUseCaseFactory,
      inject: [
        MY_ORDERS_REPOSITORY,
        VARIANT_READER_PORT,
        REMOVE_STOCK_PORT,
        REVERSE_INVENTORY_PORT,
        DECREASE_CART_LINE_QUANTITY_PORT,
        ORDER_LOGGER_PORT,
        CREATE_INVOICE_PORT,
        FINALIZE_INVOICE_PORT,
      ],
    },
    {
      provide: FindMyOrdersUseCase,
      useFactory: findMyOrdersUseCaseFactory,
      inject: [MY_ORDERS_REPOSITORY, MY_ORDERS_CUSTOMER_NAME_READER_PORT],
    },
    {
      provide: ViewMyOrderUseCase,
      useFactory: viewMyOrderUseCaseFactory,
      inject: [MY_ORDERS_REPOSITORY, MY_ORDERS_CUSTOMER_NAME_READER_PORT],
    },
    {
      provide: CancelMyOrderUseCase,
      useFactory: cancelMyOrderUseCaseFactory,
      inject: [MY_ORDERS_REPOSITORY, RESTORE_STOCK_PORT, ViewMyOrderUseCase],
    },
  ],
})
export class MyOrdersModule {}
