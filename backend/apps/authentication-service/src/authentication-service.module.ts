import { Module } from '@nestjs/common';
import { AuthenticationServiceController } from './authentication-service.controller';
import { AuthenticationServiceService } from './authentication-service.service';
import { AuthUser } from './infrastructure/entities/auth-user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import {
  CreateAuthUserUseCase,
  createAuthUserUseCaseFactory,
} from './application/use-cases/create-auth-user/create-auth-user.use-case';
import {
  DeleteAuthUserUseCase,
  deleteAuthUserUseCaseFactory,
} from './application/use-cases/delete-auth-user/delete-auth-user.use-case';
import { PASSWORD_HASHER_PORT } from './application/ports/password-hasher.port';
import { BcryptPasswordHasherAdapter } from './infrastructure/adapters/bcrypt-password-hasher.adapter';
import { AUTH_USERS_COMMAND_REPOSITORY } from './domain/repositories/auth-users-command.repository';
import { MikroAuthUsersCommandRepository } from './infrastructure/repositories/mikro-auth-users-command.repository';
import { USERS_READER_PORT } from './domain/ports/users-reader.port';
import { UsersReaderAdapter } from './infrastructure/adapters/users-reader.adapter';
import { AUTH_USERS_QUERY_REPOSITORY } from './domain/repositories/auth-users-query.repository';
import { MikroAuthUsersQueryRepository } from './infrastructure/repositories/mikro-auth-users-query.repository';
import { JwtModule } from '@nestjs/jwt';
import { SIGN_TOKEN_PORT } from './application/ports/sign-token.port';
import { SignTokenAdapter } from './infrastructure/adapters/sign-token.adapter';
import {
  LoginUseCase,
  loginUseCaseFactory,
} from './application/use-cases/login/login.use-case';
import {
  EnsureUserExistsService,
  ensureUserExistsServiceFactory,
} from './domain/services/ensure-user-exists.service';
import {
  EnsureAuthUserDoesNotExistService,
  ensureAuthUserDoesNotExistServiceFactory,
} from './domain/services/ensure-auth-user-does-not-exist.service';
import { AuthUsersController } from './presentation/public/auth-users/auth-users.controller';
import { InternalAuthUsersController } from './presentation/internal/auth-users/auth-users.controller';
import { CREATE_USER_PORT } from './application/ports/create-user.port';
import { CreateUserAdapter } from './infrastructure/adapters/create-user.adapter';
import { CREATE_CUSTOMER_PORT } from './application/ports/create-customer.port';
import { CreateCustomerAdapter } from './infrastructure/adapters/create-customer.adapter';
import {
  EmailUniquenessService,
  emailUniquenessServiceFactory,
} from './domain/services/email-uniqueness.service';
import {
  RegisterUseCase,
  registerUseCaseFactory,
} from './application/use-cases/register/register.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('AUTH_DB_HOST'),
        port: config.get<number>('AUTH_DB_PORT'),
        user: config.get<string>('AUTH_DB_USER'),
        password: config.get<string>('AUTH_DB_PASSWORD'),
        dbName: config.get<string>('AUTH_DB_NAME'),
        entities: [AuthUser],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([AuthUser]),
    JwtModule.register({}),
  ],
  controllers: [
    AuthenticationServiceController,
    AuthUsersController,
    InternalAuthUsersController,
  ],
  providers: [
    AuthenticationServiceService,
    {
      provide: PASSWORD_HASHER_PORT,
      useClass: BcryptPasswordHasherAdapter,
    },
    {
      provide: AUTH_USERS_COMMAND_REPOSITORY,
      useClass: MikroAuthUsersCommandRepository,
    },
    {
      provide: USERS_READER_PORT,
      useClass: UsersReaderAdapter,
    },
    {
      provide: AUTH_USERS_QUERY_REPOSITORY,
      useClass: MikroAuthUsersQueryRepository,
    },
    {
      provide: SIGN_TOKEN_PORT,
      useClass: SignTokenAdapter,
    },
    {
      provide: EnsureUserExistsService,
      useFactory: ensureUserExistsServiceFactory,
      inject: [USERS_READER_PORT],
    },
    {
      provide: EnsureAuthUserDoesNotExistService,
      useFactory: ensureAuthUserDoesNotExistServiceFactory,
      inject: [AUTH_USERS_COMMAND_REPOSITORY],
    },
    {
      provide: CreateAuthUserUseCase,
      useFactory: createAuthUserUseCaseFactory,
      inject: [
        AUTH_USERS_COMMAND_REPOSITORY,
        PASSWORD_HASHER_PORT,
        EnsureUserExistsService,
        EnsureAuthUserDoesNotExistService,
      ],
    },
    {
      provide: DeleteAuthUserUseCase,
      useFactory: deleteAuthUserUseCaseFactory,
      inject: [AUTH_USERS_COMMAND_REPOSITORY],
    },
    {
      provide: LoginUseCase,
      useFactory: loginUseCaseFactory,
      inject: [
        USERS_READER_PORT,
        PASSWORD_HASHER_PORT,
        AUTH_USERS_QUERY_REPOSITORY,
        SIGN_TOKEN_PORT,
      ],
    },
    {
      provide: EmailUniquenessService,
      useFactory: emailUniquenessServiceFactory,
      inject: [USERS_READER_PORT],
    },
    {
      provide: CREATE_USER_PORT,
      useClass: CreateUserAdapter,
    },
    {
      provide: CREATE_CUSTOMER_PORT,
      useClass: CreateCustomerAdapter,
    },
    {
      provide: RegisterUseCase,
      useFactory: registerUseCaseFactory,
      inject: [
        EmailUniquenessService,
        CREATE_USER_PORT,
        CREATE_CUSTOMER_PORT,
        SIGN_TOKEN_PORT,
      ],
    },
  ],
})
export class AuthenticationServiceModule {}
