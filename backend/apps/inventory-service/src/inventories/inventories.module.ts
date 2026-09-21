import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Inventory } from './infrastructure/entities/inventory.entity';
import { Batch } from './infrastructure/entities/batch.entity';
import { INVENTORIES_REPOSITORY } from './domain/repositories/inventories.repository';
import { MikroInventoriesRepository } from './infrastructure/repositories/mikro-inventories.repository';
import {
  ActivateInventoryUseCase,
  activateInventoryUseCaseFactory,
} from './application/use-cases/activate-inventory/activate-inventory.use-case';
import {
  DeactivateInventoryUseCase,
  deactivateInventoryUseCaseFactory,
} from './application/use-cases/deactivate-inventory/deactivate-inventory.use-case';
import {
  CreateInventoryUseCase,
  createInventoryUseCaseFactory,
} from './application/use-cases/create-inventory/create-inventory.use-case';
import {
  FindAllInventoriesUseCase,
  findAllInventoriesUseCaseFactory,
} from './application/use-cases/find-all-inventory/find-all-inventories.use-case';
import {
  FindInventoryByIdUseCase,
  findInventoryByIdUseCaseFactory,
} from './application/use-cases/find-inventory-by-id/find-inventory-by-id.use-case';
import {
  FindInventoryByVariantUseCase,
  findInventoryByVariantUseCaseFactory,
} from './application/use-cases/find-inventory-by-variant/find-inventory-by-variant.use-case';
import {
  AddBatchToInventoryUseCase,
  addBatchToInventoryUseCaseFactory,
} from './application/use-cases/add-batch-to-inventory/add-batch-to-inventory.use-case';
import {
  DeactivateBatchOnInventoryUseCase,
  deactivateBatchOnInventoryUseCaseFactory,
} from './application/use-cases/deactivate-batch-on-inventory/deactivate-batch-on-inventory.use-case';
import {
  ActivateBatchOnInventoryUseCase,
  activateBatchOnInventoryUseCaseFactory,
} from './application/use-cases/activate-batch-on-inventory/activate-batch-on-inventory.use-case';
import {
  DecreaseBatchStockUseCase,
  decreaseBatchStockUseCaseFactory,
} from './application/use-cases/decrease-batch-stock/decrease-batch-stock.use-case';
import {
  AdjustBatchStockUseCase,
  adjustBatchStockUseCaseFactory,
} from './application/use-cases/adjust-batch-stock/adjust-batch-stock.use-case';
import {
  FindExpiringBatchesUseCase,
  findExpiringBatchesUseCaseFactory,
} from './application/use-cases/find-expiring-batches/find-expiring-batches.use-case';
import {
  FindOverstockBatchesUseCase,
  findOverstockBatchesUseCaseFactory,
} from './application/use-cases/find-overstock-batches/find-overstock-batches.use-case';
import {
  UpdateInventoryMinStockUseCase,
  updateInventoryMinStockUseCaseFactory,
} from './application/use-cases/update-inventory-min-stock/update-inventory-min-stock.use-case';
import { InventoriesController } from './presentation/public/inventories.controller';
import { InternalInventoriesController } from './presentation/internal/internal-inventories.controller';
import {
  ReverseBatchStockUseCase,
  reverseBatchStockUseCaseFactory,
} from './application/use-cases/reverse-batch-stock/reverse-batch-stock.use-case';
import {
  RestoreBatchStockUseCase,
  restoreBatchStockUseCaseFactory,
} from './application/use-cases/restore-batch-stock/restore-batch-stock.use-case';

@Module({
  imports: [MikroOrmModule.forFeature([Inventory, Batch])],
  controllers: [InventoriesController, InternalInventoriesController],
  providers: [
    {
      provide: INVENTORIES_REPOSITORY,
      useClass: MikroInventoriesRepository,
    },
    {
      provide: ActivateInventoryUseCase,
      useFactory: activateInventoryUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: DeactivateInventoryUseCase,
      useFactory: deactivateInventoryUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: CreateInventoryUseCase,
      useFactory: createInventoryUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: FindAllInventoriesUseCase,
      useFactory: findAllInventoriesUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: FindInventoryByIdUseCase,
      useFactory: findInventoryByIdUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: FindInventoryByVariantUseCase,
      useFactory: findInventoryByVariantUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: AddBatchToInventoryUseCase,
      useFactory: addBatchToInventoryUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: DeactivateBatchOnInventoryUseCase,
      useFactory: deactivateBatchOnInventoryUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: ActivateBatchOnInventoryUseCase,
      useFactory: activateBatchOnInventoryUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: DecreaseBatchStockUseCase,
      useFactory: decreaseBatchStockUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: AdjustBatchStockUseCase,
      useFactory: adjustBatchStockUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: FindExpiringBatchesUseCase,
      useFactory: findExpiringBatchesUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: FindOverstockBatchesUseCase,
      useFactory: findOverstockBatchesUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: UpdateInventoryMinStockUseCase,
      useFactory: updateInventoryMinStockUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: ReverseBatchStockUseCase,
      useFactory: reverseBatchStockUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
    {
      provide: RestoreBatchStockUseCase,
      useFactory: restoreBatchStockUseCaseFactory,
      inject: [INVENTORIES_REPOSITORY],
    },
  ],
  exports: [
    INVENTORIES_REPOSITORY,
    ActivateInventoryUseCase,
    DeactivateInventoryUseCase,
    CreateInventoryUseCase,
    FindAllInventoriesUseCase,
    FindInventoryByIdUseCase,
    FindInventoryByVariantUseCase,
    AddBatchToInventoryUseCase,
    DeactivateBatchOnInventoryUseCase,
    ActivateBatchOnInventoryUseCase,
    DecreaseBatchStockUseCase,
    AdjustBatchStockUseCase,
    FindExpiringBatchesUseCase,
    FindOverstockBatchesUseCase,
    UpdateInventoryMinStockUseCase,
    ReverseBatchStockUseCase,
  ],
})
export class InventoriesModule {}
