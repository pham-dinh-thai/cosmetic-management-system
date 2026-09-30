import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrderTransaction } from '../shared/infrastructure/entities/order-transaction.entity';
import { ORDER_TRANSACTIONS_REPOSITORY } from './domain/repositories/order-transactions.repository';
import { MikroOrderTransactionsRepository } from './infrastructure/repositories/mikro-order-transactions.repository';

@Module({
  imports: [MikroOrmModule.forFeature([OrderTransaction])],
  providers: [
    {
      provide: ORDER_TRANSACTIONS_REPOSITORY,
      useClass: MikroOrderTransactionsRepository,
    },
  ],
  exports: [ORDER_TRANSACTIONS_REPOSITORY],
})
export class OrderTransactionsModule {}
