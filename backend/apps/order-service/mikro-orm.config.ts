import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { Order } from './src/infrastructure/entities/order.entity';
import { OrderLine } from './src/infrastructure/entities/order-line.entity';
import { OrderTransaction } from './src/infrastructure/entities/order-transaction.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.ORDER_DB_HOST,
  port: Number(process.env.ORDER_DB_PORT),
  user: process.env.ORDER_DB_USER,
  password: process.env.ORDER_DB_PASSWORD,
  dbName: process.env.ORDER_DB_NAME,
  entities: [Order, OrderLine, OrderTransaction],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});
