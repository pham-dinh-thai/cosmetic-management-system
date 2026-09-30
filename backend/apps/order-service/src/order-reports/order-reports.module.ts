import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Order } from '../shared/infrastructure/entities/order.entity';
import { OrderLine } from '../shared/infrastructure/entities/order-line.entity';
import { ORDERS_REPOSITORY } from '../orders/domain/repositories/orders.repository';
import { MikroOrdersRepository } from '../orders/infrastructure/repositories/mikro-orders.repository';
import { ORDER_TRANSACTIONS_REPOSITORY } from '../order-transactions/domain/repositories/order-transactions.repository';
import { OrderTransactionsModule } from '../order-transactions/order-transactions.module';
import {
  FindBestSellersUseCase,
  findBestSellersUseCaseFactory,
} from './application/use-cases/find-best-sellers/find-best-sellers.use-case';
import {
  FindOrderTransactionsUseCase,
  findOrderTransactionsUseCaseFactory,
} from './application/use-cases/find-order-transactions/find-order-transactions.use-case';
import { BestSellersController } from './presentation/public/reports/best-sellers.controller';
import { OrderTransactionsController } from './presentation/public/reports/order-transactions.controller';

@Module({
  imports: [
    OrderTransactionsModule,
    MikroOrmModule.forFeature([Order, OrderLine]),
  ],
  controllers: [BestSellersController, OrderTransactionsController],
  providers: [
    {
      provide: ORDERS_REPOSITORY,
      useClass: MikroOrdersRepository,
    },
    {
      provide: FindBestSellersUseCase,
      useFactory: findBestSellersUseCaseFactory,
      inject: [ORDERS_REPOSITORY],
    },
    {
      provide: FindOrderTransactionsUseCase,
      useFactory: findOrderTransactionsUseCaseFactory,
      inject: [ORDER_TRANSACTIONS_REPOSITORY],
    },
  ],
})
export class OrderReportsModule {}
