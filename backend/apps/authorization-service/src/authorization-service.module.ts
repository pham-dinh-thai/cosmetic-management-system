import { Module } from '@nestjs/common';
import { AuditClientModule } from '@app/audit-client';
import { ROLES_REPOSITORY } from './domain/repositories/roles.repository';
import { MikroRolesRepository } from './infrastructure/repositories/mikro-roles.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Role } from './infrastructure/entities/role.entity';
import {
  CreateRoleUseCase,
  createRoleUseCaseFactory,
} from './application/use-cases/create-role/create-role.use-case';
import {
  DeleteRoleUseCase,
  deleteRoleUseCaseFactory,
} from './application/use-cases/delete-role/delete-role.use-case';
import { JwtModule } from '@nestjs/jwt';
import { RolesController } from './presentation/public/roles/roles.controller';
import { InternalRolesController } from './presentation/internal/roles/roles.controller';
import {
  FindAllRolesUseCase,
  findAllRolesUseCaseFactory,
} from './application/use-cases/find-all-roles/find-all-roles.use-case';
import {
  FindRoleByIdUseCase,
  findRoleByIdUseCaseFactory,
} from './application/use-cases/find-role-by-id/find-role-by-id.use-case';
import {
  CreatePermissionUseCase,
  createPermissionUseCaseFactory,
} from './application/use-cases/create-permission/create-permission.use-case';
import { PERMISSIONS_REPOSITORY } from './domain/permission/repositories/permissions.repository';
import { MikroPermissionsRepository } from './infrastructure/repositories/mikro-permissions.repository';
import {
  FindAllPermissionsUseCase,
  findAllPermissionsUseCaseFactory,
} from './application/use-cases/find-all-permissions/find-all-permissions.use-case';
import {
  ActivateRoleUseCase,
  activateRoleUseCaseFactory,
} from './application/use-cases/activate-role/activate-role.use-case';
import {
  DeactivateRoleUseCase,
  deactivateRoleUseCaseFactory,
} from './application/use-cases/deactivate-role/deactivate-role.use-case';
import {
  ActivatePermissionUseCase,
  activatePermissionUseCaseFactory,
} from './application/use-cases/activate-permission/activate-permission.use-case';
import {
  DeactivatePermissionUseCase,
  deactivatePermissionUseCaseFactory,
} from './application/use-cases/deactivate-permission/deactivate-permission.use-case';
import {
  GrantPermissionToRoleUseCase,
  grantPermissionToRoleUseCaseFactory,
} from './application/use-cases/grant-permission-to-role/grant-permission-to-role.use-case';
import { Permission } from './infrastructure/entities/permission.entity';
import { RolePermission } from './infrastructure/entities/roles_permissions.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    AuditClientModule,
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('AUTHORIZATION_DB_HOST'),
        port: config.get<number>('AUTHORIZATION_DB_PORT'),
        user: config.get<string>('AUTHORIZATION_DB_USER'),
        password: config.get<string>('AUTHORIZATION_DB_PASSWORD'),
        dbName: config.get<string>('AUTHORIZATION_DB_NAME'),
        entities: [Role, Permission, RolePermission],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Role, Permission, RolePermission]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [RolesController, InternalRolesController],
  providers: [
    {
      provide: ROLES_REPOSITORY,
      useClass: MikroRolesRepository,
    },
    {
      provide: FindAllRolesUseCase,
      useFactory: findAllRolesUseCaseFactory,
      inject: [ROLES_REPOSITORY],
    },
    {
      provide: FindRoleByIdUseCase,
      useFactory: findRoleByIdUseCaseFactory,
      inject: [ROLES_REPOSITORY],
    },
    {
      provide: DeleteRoleUseCase,
      useFactory: deleteRoleUseCaseFactory,
      inject: [ROLES_REPOSITORY],
    },
    {
      provide: CreateRoleUseCase,
      useFactory: createRoleUseCaseFactory,
      inject: [ROLES_REPOSITORY],
    },
    {
      provide: PERMISSIONS_REPOSITORY,
      useClass: MikroPermissionsRepository,
    },
    {
      provide: CreatePermissionUseCase,
      useFactory: createPermissionUseCaseFactory,
      inject: [PERMISSIONS_REPOSITORY],
    },
    {
      provide: FindAllPermissionsUseCase,
      useFactory: findAllPermissionsUseCaseFactory,
      inject: [PERMISSIONS_REPOSITORY],
    },
    {
      provide: ActivateRoleUseCase,
      useFactory: activateRoleUseCaseFactory,
      inject: [ROLES_REPOSITORY],
    },
    {
      provide: DeactivateRoleUseCase,
      useFactory: deactivateRoleUseCaseFactory,
      inject: [ROLES_REPOSITORY],
    },
    {
      provide: ActivatePermissionUseCase,
      useFactory: activatePermissionUseCaseFactory,
      inject: [PERMISSIONS_REPOSITORY],
    },
    {
      provide: DeactivatePermissionUseCase,
      useFactory: deactivatePermissionUseCaseFactory,
      inject: [PERMISSIONS_REPOSITORY],
    },
    {
      provide: GrantPermissionToRoleUseCase,
      useFactory: grantPermissionToRoleUseCaseFactory,
      inject: [ROLES_REPOSITORY, PERMISSIONS_REPOSITORY],
    },
  ],
})
export class AuthorizationServiceModule {}
