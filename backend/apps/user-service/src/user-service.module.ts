import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './infrastructure/entities/user.entity';
import { UuidModule } from 'nestjs-uuid';
import {
  createUserUseCaseFactory,
  CreateUserUseCase,
} from './application/use-cases/create-user/create-user.use-case';
import { UserUniquenessService } from './domain/services/user-uniqueness.service';
import {
  deleteUserUseCaseFactory,
  DeleteUserUseCase,
} from './application/use-cases/delete-user/delete-user.use-case';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './presentation/public/users/users.controller';
import { InternalUsersController } from './presentation/internal/users/users.controller';
import { USERS_REPOSITORY } from './domain/repositories/users.repository';
import { MikroUsersRepository } from './infrastructure/repositories/mikro-users.repository';
import { CREATE_AUTH_USER_PORT } from './application/use-cases/create-user/ports/create-auth-user.port';
import { CreateAuthUserAdapter } from './infrastructure/adapters/create-auth-user.adapter';
import { DELETE_AUTH_USER_PORT } from './application/use-cases/delete-user/ports/delete-auth-user.port';
import { DeleteAuthUserAdapter } from './infrastructure/adapters/delete-auth-user.adapter';
import { type IUsersRepository } from './domain/repositories/users.repository';
import {
  updateUserInformationUseCaseFactory,
  UpdateUserInformationUseCase,
} from './application/use-cases/update-user-information/update-user-information.use-case';
import { ROLE_READER_PORT } from './application/ports/role-reader.port';
import { RoleReaderAdapter } from './infrastructure/adapters/role-reader.adapter';
import {
  UpdateUserRoleUseCase,
  updateUserRoleUseCaseFactory,
} from './application/use-cases/update-user-role/update-user-role.use-case';
import {
  FindAllUserUseCase,
  findAllUserUseCaseFactory,
} from './application/use-cases/find-user/find-all/find-users.use-case';
import {
  FindUserByIdUseCase,
  findUserByIdUseCaseFactory,
} from './application/use-cases/find-user/find-by-id/find-user-by-id.use-case';
import {
  FindUserByEmailUseCase,
  findUserByEmailUseCaseFactory,
} from './application/use-cases/find-user/find-by-email/find-user-by-email.use-case';
import {
  ActivateUserUseCase,
  activateUserUseCaseFactory,
} from './application/use-cases/activate-user/activate-user.use-case';
import {
  DeactivateUserUseCase,
  deactivateUserUseCaseFactory,
} from './application/use-cases/deactivate-user/deactivate-user.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('USER_DB_HOST'),
        port: config.get<number>('USER_DB_PORT'),
        user: config.get<string>('USER_DB_USER'),
        password: config.get<string>('USER_DB_PASSWORD'),
        dbName: config.get<string>('USER_DB_NAME'),
        entities: [User],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([User]),
    UuidModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UsersController, InternalUsersController],
  providers: [
    { provide: USERS_REPOSITORY, useClass: MikroUsersRepository },
    {
      provide: UserUniquenessService,
      useFactory: (repo: IUsersRepository) => new UserUniquenessService(repo),
      inject: [USERS_REPOSITORY],
    },
    {
      provide: FindUserByIdUseCase,
      useFactory: findUserByIdUseCaseFactory,
      inject: [USERS_REPOSITORY],
    },
    {
      provide: FindAllUserUseCase,
      useFactory: findAllUserUseCaseFactory,
      inject: [USERS_REPOSITORY],
    },
    {
      provide: FindUserByEmailUseCase,
      useFactory: findUserByEmailUseCaseFactory,
      inject: [USERS_REPOSITORY],
    },
    {
      provide: CreateUserUseCase,
      useFactory: createUserUseCaseFactory,
      inject: [USERS_REPOSITORY, CREATE_AUTH_USER_PORT, UserUniquenessService],
    },
    {
      provide: UpdateUserInformationUseCase,
      useFactory: updateUserInformationUseCaseFactory,
      inject: [USERS_REPOSITORY],
    },
    {
      provide: DELETE_AUTH_USER_PORT,
      useFactory: (config: ConfigService) => new DeleteAuthUserAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: deleteUserUseCaseFactory,
      inject: [USERS_REPOSITORY, DELETE_AUTH_USER_PORT],
    },
    {
      provide: CREATE_AUTH_USER_PORT,
      useFactory: (config: ConfigService) => new CreateAuthUserAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: ROLE_READER_PORT,
      useFactory: (config: ConfigService) => new RoleReaderAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: UpdateUserRoleUseCase,
      useFactory: updateUserRoleUseCaseFactory,
      inject: [USERS_REPOSITORY, ROLE_READER_PORT],
    },
    {
      provide: ActivateUserUseCase,
      useFactory: activateUserUseCaseFactory,
      inject: [USERS_REPOSITORY],
    },
    {
      provide: DeactivateUserUseCase,
      useFactory: deactivateUserUseCaseFactory,
      inject: [USERS_REPOSITORY],
    },
  ],
})
export class UserServiceModule {}
