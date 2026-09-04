import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { PurchaseOrder } from './src/infrastructure/entities/purchase-order.entity';
import { PurchaseOrderLine } from './src/infrastructure/entities/purchase-order-line.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.PURCHASE_DB_HOST,
  port: Number(process.env.PURCHASE_DB_PORT),
  user: process.env.PURCHASE_DB_USER,
  password: process.env.PURCHASE_DB_PASSWORD,
  dbName: process.env.PURCHASE_DB_NAME,
  entities: [PurchaseOrder, PurchaseOrderLine],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});
