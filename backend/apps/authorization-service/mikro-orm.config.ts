import { join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { Role } from './src/infrastructure/entities/role.entity';
import { Permission } from './src/infrastructure/entities/permission.entity';
import { RolePermission } from './src/infrastructure/entities/roles_permissions.entity';

loadEnv({ path: join(__dirname, '../../../.env') });

export default defineConfig({
  host: process.env.AUTHORIZATION_DB_HOST,
  port: Number(process.env.AUTHORIZATION_DB_PORT),
  user: process.env.AUTHORIZATION_DB_USER,
  password: process.env.AUTHORIZATION_DB_PASSWORD,
  dbName: process.env.AUTHORIZATION_DB_NAME,
  entities: [Role, Permission, RolePermission],
  migrations: {
    path: join(__dirname, 'dist/migrations'),
    pathTs: join(__dirname, 'migrations'),
  },
  debug: false,
});
