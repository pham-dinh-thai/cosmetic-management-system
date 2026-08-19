import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { AuthUser } from './src/infrastructure/entities/auth-user.entity';

loadEnv({ path: join(__dirname, '../../.env') });

export default defineConfig({
  host: process.env.AUTH_DB_HOST,
  port: Number(process.env.AUTH_DB_PORT),
  user: process.env.AUTH_DB_USER,
  password: process.env.AUTH_DB_PASSWORD,
  dbName: process.env.AUTH_DB_NAME,
  entities: [AuthUser],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});
