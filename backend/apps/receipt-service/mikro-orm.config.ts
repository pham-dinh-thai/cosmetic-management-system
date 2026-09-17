import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { Receipt } from './src/infrastructure/entities/receipt.entity';
import { Payment } from './src/infrastructure/entities/payment.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.RECEIPT_DB_HOST,
  port: Number(process.env.RECEIPT_DB_PORT),
  user: process.env.RECEIPT_DB_USER,
  password: process.env.RECEIPT_DB_PASSWORD,
  dbName: process.env.RECEIPT_DB_NAME,
  entities: [Receipt, Payment],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});