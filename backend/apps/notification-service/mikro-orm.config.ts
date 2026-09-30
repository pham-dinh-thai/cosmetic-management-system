import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { EmailLog } from './src/infrastructure/entities/email-log.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.NOTIFICATION_DB_HOST,
  port: Number(process.env.NOTIFICATION_DB_PORT),
  user: process.env.NOTIFICATION_DB_USER,
  password: process.env.NOTIFICATION_DB_PASSWORD,
  dbName: process.env.NOTIFICATION_DB_NAME,
  entities: [EmailLog],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});
