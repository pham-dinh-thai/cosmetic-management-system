import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { Cosmetic } from './src/infrastructure/entities/cosmetic.entity';
import { CosmeticVariant } from './src/infrastructure/entities/cosmetic-variant.entity';
import { CosmeticCategory } from './src/infrastructure/entities/cosmetic-category.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.COSMETIC_DB_HOST,
  port: Number(process.env.COSMETIC_DB_PORT),
  user: process.env.COSMETIC_DB_USER,
  password: process.env.COSMETIC_DB_PASSWORD,
  dbName: process.env.COSMETIC_DB_NAME,
  entities: [Cosmetic, CosmeticVariant, CosmeticCategory],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});
