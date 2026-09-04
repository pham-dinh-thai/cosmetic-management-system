import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { Inventory } from './src/infrastructure/entities/inventory.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.INVENTORY_DB_HOST,
  port: Number(process.env.INVENTORY_DB_PORT),
  user: process.env.INVENTORY_DB_USER,
  password: process.env.INVENTORY_DB_PASSWORD,
  dbName: process.env.INVENTORY_DB_NAME,
  entities: [Inventory],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});
