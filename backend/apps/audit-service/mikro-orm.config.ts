import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { AuditLog } from './src/infrastructure/entities/audit-log.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.AUDIT_DB_HOST,
  port: Number(process.env.AUDIT_DB_PORT),
  user: process.env.AUDIT_DB_USER,
  password: process.env.AUDIT_DB_PASSWORD,
  dbName: process.env.AUDIT_DB_NAME,
  entities: [AuditLog],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});