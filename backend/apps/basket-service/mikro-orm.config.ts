import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { Cart } from './src/infrastructure/entities/cart.entity';
import { CartItem } from './src/infrastructure/entities/cart-item.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.BASKET_DB_HOST,
  port: Number(process.env.BASKET_DB_PORT),
  user: process.env.BASKET_DB_USER,
  password: process.env.BASKET_DB_PASSWORD,
  dbName: process.env.BASKET_DB_NAME,
  entities: [Cart, CartItem],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});