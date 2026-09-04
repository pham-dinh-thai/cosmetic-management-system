import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { Supplier } from './src/infrastructure/entities/supplier.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.SUPPLIER_DB_HOST,
  port: Number(process.env.SUPPLIER_DB_PORT),
  user: process.env.SUPPLIER_DB_USER,
  password: process.env.SUPPLIER_DB_PASSWORD,
  dbName: process.env.SUPPLIER_DB_NAME,
  entities: [Supplier],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});
