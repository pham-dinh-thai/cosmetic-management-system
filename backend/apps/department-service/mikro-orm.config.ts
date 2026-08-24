import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { Department } from './src/infrastructure/entities/department.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.DEPARTMENT_DB_HOST,
  port: Number(process.env.DEPARTMENT_DB_PORT),
  user: process.env.DEPARTMENT_DB_USER,
  password: process.env.DEPARTMENT_DB_PASSWORD,
  dbName: process.env.DEPARTMENT_DB_NAME,
  entities: [Department],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});
