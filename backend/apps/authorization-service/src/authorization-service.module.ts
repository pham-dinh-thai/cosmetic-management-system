import { Module } from '@nestjs/common';
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
  FindAllRoleUseCase,
  findAllRoleUseCaseFactory,
} from './application/use-cases/find-role/find-all/find-all-role.use-case';
import {
  FindRoleByIdUseCase,
  findRoleByIdUseCaseFactory,
} from './application/use-cases/find-role/find-by-id/find-role-by-id.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('AUTHORIZATION_DB_HOST'),
        port: config.get<number>('AUTHORIZATION_DB_PORT'),
        user: config.get<string>('AUTHORIZATION_DB_USER'),
        password: config.get<string>('AUTHORIZATION_DB_PASSWORD'),
        dbName: config.get<string>('AUTHORIZATION_DB_NAME'),
        entities: [Role],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Role]),
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
      provide: FindAllRoleUseCase,
      useFactory: findAllRoleUseCaseFactory,
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
  ],
})
export class AuthorizationServiceModule {}
