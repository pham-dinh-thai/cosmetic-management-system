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

@Module({
  imports: [MikroOrmModule.forFeature([Inventory, Batch])],
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
  ],
})
export class InventoriesModule {}
