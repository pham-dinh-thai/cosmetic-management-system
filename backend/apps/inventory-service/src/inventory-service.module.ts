import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Inventory } from './inventories/infrastructure/entities/inventory.entity';
import { Batch } from './inventories/infrastructure/entities/batch.entity';
import { StockAdjustment } from './stock-adjustments/infrastructure/entities/stock-adjustment.entity';
import { InventoriesModule } from './inventories/inventories.module';
import { StockAdjustmentsModule } from './stock-adjustments/stock-adjustments.module';

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
        entities: [Inventory, Batch, StockAdjustment],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Inventory, Batch, StockAdjustment]),
    JwtModule.registerAsync({
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
    InventoriesModule,
    StockAdjustmentsModule,
  ],
})
export class InventoryServiceModule {}
