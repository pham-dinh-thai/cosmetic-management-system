import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { Category } from './src/infrastructure/entities/category.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.CATEGORY_DB_HOST,
  port: Number(process.env.CATEGORY_DB_PORT),
  user: process.env.CATEGORY_DB_USER,
  password: process.env.CATEGORY_DB_PASSWORD,
  dbName: process.env.CATEGORY_DB_NAME,
  entities: [Category],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});
