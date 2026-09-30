import { Module } from '@nestjs/common';
import { AuditClientModule } from '@app/audit-client';
import { RedisClientModule } from '@app/redis-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Order } from './shared/infrastructure/entities/order.entity';
import { OrderLine } from './shared/infrastructure/entities/order-line.entity';
import { OrderTransaction } from './shared/infrastructure/entities/order-transaction.entity';
import { MyOrdersModule } from './my-orders/my-orders.module';
import { OrderReportsModule } from './order-reports/order-reports.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    AuditClientModule,
    RedisClientModule,
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
      global: true,
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
    MyOrdersModule,
    OrderReportsModule,
    OrdersModule,
  ],
})
export class OrderServiceModule {}
