import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './infrastructure/entities/user.entity';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id/find-user-by-id.use-case';
import { UuidModule } from 'nestjs-uuid';
import { CreateUserUseCase } from './application/use-cases/create-user/create-user.use-case';
import { UserUniquenessService } from './domain/services/user-uniqueness.service';
import { FindUsersUseCase } from './application/use-cases/find-users/find-users.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user/delete-user.use-case';
import { FindUserIdByEmailUseCase } from './application/use-cases/find-user-id-by-email/find-user-id-by-email.use-case';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './presentation/public/users/users.controller';
import { InternalUsersController } from './presentation/internal/users/users.controller';
import { USERS_REPOSITORY } from './domain/repositories/users.repository';
import { MikroUsersRepository } from './infrastructure/repositories/mikro-users.repository';
import { CREATE_AUTH_USER_PORT } from './application/ports/create-auth-user.port';
import { CreateAuthUserAdapter } from './infrastructure/adapters/create-auth-user.adapter';
import { type IUsersRepository } from './domain/repositories/users.repository';

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
    FindUserByIdUseCase,
    FindUsersUseCase,
    FindUserIdByEmailUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    {
      provide: UserUniquenessService,
      useFactory: (repo: IUsersRepository) =>
        new UserUniquenessService(repo),
      inject: [USERS_REPOSITORY],
    },
    {
      provide: USERS_REPOSITORY,
      useClass: MikroUsersRepository,
    },
    {
      provide: CREATE_AUTH_USER_PORT,
      useClass: CreateAuthUserAdapter,
    },
  ],
})
export class UserServiceModule {}
