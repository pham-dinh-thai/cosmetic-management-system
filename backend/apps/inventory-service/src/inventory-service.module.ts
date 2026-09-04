import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Inventory } from './infrastructure/entities/inventory.entity';
import { InventoryController } from './presentation/public/inventory/inventory.controller';
import { InternalInventoryController } from './presentation/internal/inventory/internal-inventory.controller';
import { INVENTORY_REPOSITORY } from './domain/repositories/inventory.repository';
import { MikroInventoryRepository } from './infrastructure/repositories/mikro-inventory.repository';
import {
  FindAllInventoriesUseCase,
  findAllInventoriesUseCaseFactory,
} from './application/use-cases/find-all-inventory/find-all-inventories.use-case';
import {
  FindInventoryByVariantUseCase,
  findInventoryByVariantUseCaseFactory,
} from './application/use-cases/find-inventory-by-variant/find-inventory-by-variant.use-case';
import {
  AdjustInventoryUseCase,
  adjustInventoryUseCaseFactory,
} from './application/use-cases/adjust-inventory/adjust-inventory.use-case';
import {
  IncreaseInventoryUseCase,
  increaseInventoryUseCaseFactory,
} from './application/use-cases/increase-inventory/increase-inventory.use-case';
import {
  DecreaseInventoryUseCase,
  decreaseInventoryUseCaseFactory,
} from './application/use-cases/decrease-inventory/decrease-inventory.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('INVENTORY_DB_HOST'),
        port: config.get<number>('INVENTORY_DB_PORT'),
        user: config.get<string>('INVENTORY_DB_USER'),
        password: config.get<string>('INVENTORY_DB_PASSWORD'),
        dbName: config.get<string>('INVENTORY_DB_NAME'),
        entities: [Inventory],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Inventory]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [InventoryController, InternalInventoryController],
  providers: [
    { provide: INVENTORY_REPOSITORY, useClass: MikroInventoryRepository },
    {
      provide: FindAllInventoriesUseCase,
      useFactory: findAllInventoriesUseCaseFactory,
      inject: [INVENTORY_REPOSITORY],
    },
    {
      provide: FindInventoryByVariantUseCase,
      useFactory: findInventoryByVariantUseCaseFactory,
      inject: [INVENTORY_REPOSITORY],
    },
    {
      provide: AdjustInventoryUseCase,
      useFactory: adjustInventoryUseCaseFactory,
      inject: [INVENTORY_REPOSITORY],
    },
    {
      provide: IncreaseInventoryUseCase,
      useFactory: increaseInventoryUseCaseFactory,
      inject: [INVENTORY_REPOSITORY],
    },
    {
      provide: DecreaseInventoryUseCase,
      useFactory: decreaseInventoryUseCaseFactory,
      inject: [INVENTORY_REPOSITORY],
    },
  ],
})
export class InventoryServiceModule {}
