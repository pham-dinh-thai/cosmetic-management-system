import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { User } from './src/infrastructure/entities/user.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.USER_DB_HOST,
  port: Number(process.env.USER_DB_PORT),
  user: process.env.USER_DB_USER,
  password: process.env.USER_DB_PASSWORD,
  dbName: process.env.USER_DB_NAME,
  entities: [User],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});
