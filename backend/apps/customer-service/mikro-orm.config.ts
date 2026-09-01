import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { Customer } from './src/infrastructure/entities/customer.entity';
import { Address } from './src/infrastructure/entities/address.entity';
import { Phone } from './src/infrastructure/entities/phone.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.CUSTOMER_DB_HOST,
  port: Number(process.env.CUSTOMER_DB_PORT),
  user: process.env.CUSTOMER_DB_USER,
  password: process.env.CUSTOMER_DB_PASSWORD,
  dbName: process.env.CUSTOMER_DB_NAME,
  entities: [Customer, Address, Phone],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});
