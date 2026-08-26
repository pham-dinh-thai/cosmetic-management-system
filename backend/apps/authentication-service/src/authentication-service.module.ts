import { Module } from '@nestjs/common';
import { AuthenticationServiceController } from './authentication-service.controller';
import { AuthenticationServiceService } from './authentication-service.service';
import { UuidModule } from 'nestjs-uuid';
import { AuthUser } from './infrastructure/entities/auth-user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { CREATE_AUTH_USER_ID_PORT } from './application/ports/create-auth-user-id.port';
import { CreateAuthUserUuidAdapter } from './infrastructure/adapters/create-user-uuid.adapter';
import { CreateAuthUserUseCase } from './application/use-cases/create-auth-user/create-auth-user.use-case';
import { PASSWORD_HASHER_PORT } from './application/ports/password-hasher.port';
import { BcryptPasswordHasherAdapter } from './infrastructure/adapters/bcrypt-password-hasher.adapter';
import { AUTH_USERS_COMMAND_REPOSITORY } from './domain/repositories/auth-users-command.repository';
import { MikroAuthUsersCommandRepository } from './infrastructure/repositories/mikro-auth-users-command.repository';
import { USER_READER_PORT } from './domain/ports/user-reader.port';
import { UserReaderAdapter } from './infrastructure/adapters/user-reader.adapter';
import { AUTH_USERS_QUERY_REPOSITORY } from './domain/repositories/auth-users-query.repository';
import { MikroAuthUsersQueryRepository } from './infrastructure/repositories/mikro-auth-users-query.repository';
import { JwtModule } from '@nestjs/jwt';
import { SIGN_TOKEN_PORT } from './application/ports/sign-token.port';
import { SignTokenAdapter } from './infrastructure/adapters/sign-token.adapter';
import { LoginUseCase } from './application/use-cases/login/login.use-case';
import { EnsureUserExistsService } from './domain/services/ensure-user-exists.service';
import { EnsureAuthUserDoesNotExistService } from './domain/services/ensure-auth-user-does-not-exist.service';
import { AuthUsersController } from './presentation/public/auth-users/auth-users.controller';
import { InternalAuthUsersController } from './presentation/internal/auth-users/auth-users.controller';

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
    UuidModule,
    JwtModule.register({}),
  ],
  controllers: [
    AuthenticationServiceController,
    AuthUsersController,
    InternalAuthUsersController,
  ],
  providers: [
    AuthenticationServiceService,
    CreateAuthUserUseCase,
    LoginUseCase,
    {
      provide: CREATE_AUTH_USER_ID_PORT,
      useClass: CreateAuthUserUuidAdapter,
    },
    {
      provide: PASSWORD_HASHER_PORT,
      useClass: BcryptPasswordHasherAdapter,
    },
    {
      provide: AUTH_USERS_COMMAND_REPOSITORY,
      useClass: MikroAuthUsersCommandRepository,
    },
    {
      provide: USER_READER_PORT,
      useClass: UserReaderAdapter,
    },
    {
      provide: AUTH_USERS_QUERY_REPOSITORY,
      useClass: MikroAuthUsersQueryRepository,
    },
    {
      provide: SIGN_TOKEN_PORT,
      useClass: SignTokenAdapter,
    },
    EnsureUserExistsService,
    EnsureAuthUserDoesNotExistService,
  ],
})
export class AuthenticationServiceModule {}
