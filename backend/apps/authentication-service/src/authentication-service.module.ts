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
import { AuthUsersController } from './presentation/auth-users/auth-users.controller';
import { AUTH_USERS_COMMAND_REPOSITORY } from './domain/repositories/auth-users-command.repository';
import { MikroAuthUsersCommandRepository } from './infrastructure/repositories/mikro-auth-users-command.repository';

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
  ],
  controllers: [AuthenticationServiceController, AuthUsersController],
  providers: [
    AuthenticationServiceService,
    CreateAuthUserUseCase,
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
  ],
})
export class AuthenticationServiceModule {}
