import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { STOCK_ADJUSTMENT_REPOSITORY } from './domain/repositories/stock-adjustments.repository';
import { MikroStockAdjustmentsRepository } from './infrastructure/repositories/mikro-stock-adjustments.repository';
import { StockAdjustment } from './infrastructure/entities/stock-adjustment.entity';
import {
  AdjustBatchStockWithReasonUseCase,
  adjustBatchStockWithReasonUseCaseFactory,
} from './application/use-cases/adjust-batch-stock-with-reason/adjust-batch-stock-with-reason.use-case';
import {
  FindStockAdjustmentsUseCase,
  findStockAdjustmentsUseCaseFactory,
} from './application/use-cases/find-stock-adjustments/find-stock-adjustments.use-case';
import { INVENTORIES_REPOSITORY } from '../inventories/domain/repositories/inventories.repository';
import { InventoriesModule } from '../inventories/inventories.module';
import { StockAdjustmentsController } from './presentation/stock-adjustments.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature([StockAdjustment]),
    InventoriesModule,
  ],
  controllers: [StockAdjustmentsController],
  providers: [
    {
      provide: STOCK_ADJUSTMENT_REPOSITORY,
      useClass: MikroStockAdjustmentsRepository,
    },
    {
      provide: AdjustBatchStockWithReasonUseCase,
      useFactory: adjustBatchStockWithReasonUseCaseFactory,
      inject: [STOCK_ADJUSTMENT_REPOSITORY, INVENTORIES_REPOSITORY],
    },
    {
      provide: FindStockAdjustmentsUseCase,
      useFactory: findStockAdjustmentsUseCaseFactory,
      inject: [STOCK_ADJUSTMENT_REPOSITORY],
    },
  ],
  exports: [AdjustBatchStockWithReasonUseCase, FindStockAdjustmentsUseCase],
})
export class StockAdjustmentsModule {}