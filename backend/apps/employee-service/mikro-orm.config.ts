import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { Employee } from './src/infrastructure/entities/employee.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.EMPLOYEE_DB_HOST,
  port: Number(process.env.EMPLOYEE_DB_PORT),
  user: process.env.EMPLOYEE_DB_USER,
  password: process.env.EMPLOYEE_DB_PASSWORD,
  dbName: process.env.EMPLOYEE_DB_NAME,
  entities: [Employee],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});
