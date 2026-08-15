import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { User } from './src/infrastructure/entities/user.entity';

loadEnv({ path: join(__dirname, '.env') });

export default defineConfig({
  host: process.env.USER_DB_HOST ?? 'localhost',
  port: Number(process.env.USER_DB_PORT ?? 5432),
  user: process.env.USER_DB_USER ?? 'cosmetic',
  password: process.env.USER_DB_PASSWORD ?? 'cosmetic',
  dbName: process.env.USER_DB_NAME ?? 'cosmetic_user_service',
  entities: [User],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});
