import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Order } from './infrastructure/entities/order.entity';
import { OrderLine } from './infrastructure/entities/order-line.entity';
import { OrderTransaction } from './infrastructure/entities/order-transaction.entity';
import { OrdersController } from './presentation/public/orders/orders.controller';
import { MyOrdersController } from './presentation/public/orders/my-orders.controller';
import { ClientOrdersController } from './presentation/public/orders/client-orders.controller';
import { PosOrdersController } from './presentation/public/orders/pos-orders.controller';
import { BestSellersController } from './presentation/public/orders/best-sellers.controller';
import { InternalOrdersController } from './presentation/internal/orders/internal-orders.controller';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';
import { ORDERS_REPOSITORY } from './domain/repositories/orders.repository';
import { ORDER_TRANSACTIONS_REPOSITORY } from './domain/repositories/order-transactions.repository';
import { REMOVE_STOCK_PORT } from './domain/ports/remove-stock.port';
import { CREATE_INVOICE_PORT } from './domain/ports/create-invoice.port';
import { RESTORE_STOCK_PORT } from './domain/ports/restore-stock.port';
import { MikroOrdersRepository } from './infrastructure/repositories/mikro-orders.repository';
import { MikroOrderTransactionsRepository } from './infrastructure/repositories/mikro-order-transactions.repository';
import { RemoveStockAdapter } from './infrastructure/adapters/remove-stock.adapter';
import { CreateInvoiceAdapter } from './infrastructure/adapters/create-invoice.adapter';
import { VariantsReaderAdapter } from './infrastructure/adapters/variants-reader.adapter';
import { ReverseInventoryAdapter } from './infrastructure/adapters/reverse-inventory.adapter';
import { RestoreStockAdapter } from './infrastructure/adapters/restore-stock.adapter';
import { DecreaseCartLineQuantityAdapter } from './infrastructure/adapters/decrease-cart-line-quantity.adapter';
import { OrderLoggerAdapter } from './infrastructure/adapters/order-logger.adapter';
import { VariantLabelReaderAdapter } from './infrastructure/adapters/variant-label-reader.adapter';
import { EmployeeCodeReaderAdapter } from './infrastructure/adapters/employee-code-reader.adapter';
import { CustomerNameReaderAdapter } from './infrastructure/adapters/customer-name-reader.adapter';
import { CustomerIdReaderAdapter } from './infrastructure/adapters/customer-id-reader.adapter';
import { VARIANT_LABEL_READER_PORT } from './application/use-cases/print-order/ports/variant-label-reader.port';
import { EMPLOYEE_CODE_READER_PORT } from './application/use-cases/print-order/ports/employee-code-reader.port';
import { CUSTOMER_NAME_READER_PORT } from './domain/ports/customer-name-reader.port';
import { CUSTOMER_ID_READER_PORT } from './application/ports/customer-id-reader.port';
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
  UpdateOrderStatusUseCase,
  updateOrderStatusUseCaseFactory,
} from './application/use-cases/update-order-status/update-order-status.use-case';
import {
  UpdateOrderPaymentStatusUseCase,
  updateOrderPaymentStatusUseCaseFactory,
} from './application/use-cases/update-order-payment-status/update-order-payment-status.use-case';
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
    MyOrdersController,
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
      provide: CREATE_INVOICE_PORT,
      useFactory: (config: ConfigService) => new CreateInvoiceAdapter(config),
      inject: [ConfigService],
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
      provide: CUSTOMER_NAME_READER_PORT,
      useFactory: (config: ConfigService) =>
        new CustomerNameReaderAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: CUSTOMER_ID_READER_PORT,
      useFactory: (config: ConfigService) =>
        new CustomerIdReaderAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: REVERSE_INVENTORY_PORT,
      useFactory: (config: ConfigService) =>
        new ReverseInventoryAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: RESTORE_STOCK_PORT,
      useFactory: (config: ConfigService) => new RestoreStockAdapter(config),
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
      inject: [ORDERS_REPOSITORY, CUSTOMER_NAME_READER_PORT],
    },
    {
      provide: FindOrderByIdUseCase,
      useFactory: findOrderByIdUseCaseFactory,
      inject: [ORDERS_REPOSITORY, CUSTOMER_NAME_READER_PORT],
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
      provide: UpdateOrderStatusUseCase,
      useFactory: updateOrderStatusUseCaseFactory,
      inject: [
        ORDERS_REPOSITORY,
        ORDER_TRANSACTIONS_REPOSITORY,
        CREATE_INVOICE_PORT,
        RESTORE_STOCK_PORT,
      ],
    },
    {
      provide: UpdateOrderPaymentStatusUseCase,
      useFactory: updateOrderPaymentStatusUseCaseFactory,
      inject: [ORDERS_REPOSITORY],
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
        CREATE_INVOICE_PORT,
      ],
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
