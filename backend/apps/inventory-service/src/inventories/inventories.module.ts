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
  ],
  exports: [
    INVENTORIES_REPOSITORY,
    ActivateInventoryUseCase,
    DeactivateInventoryUseCase,
  ],
})
export class InventoriesModule {}
