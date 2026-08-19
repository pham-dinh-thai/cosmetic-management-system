import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { User } from './infrastructure/entities/user.entity';
import { UsersController } from './presentation/users/users.controller';
import { FindUserByIdUseCase } from './application/use-cases/find-user-by-id/find-user-by-id.use-case';
import { MikroUsersQueryRepository } from './infrastructure/repositories/mikro-users-query.repository';
import { USERS_QUERY_REPOSITORY } from './domain/repositories/users-query.repository';
import { UuidModule } from 'nestjs-uuid';
import { CREATE_USER_ID_PORT } from './application/ports/create-user-id.port';
import { CreateUserUuidAdapter } from './infrastructure/adapters/create-user-uuid.adapter';
import { CreateUserUseCase } from './application/use-cases/create-user/create-user.use-case';
import { USERS_COMMAND_REPOSITORY } from './domain/repositories/users-command.repository';
import { MikroUsersCommandRepository } from './infrastructure/repositories/mikro-users-command.repository';
import { UserUniquenessService } from './domain/services/user-uniqueness.service';
import { FindUsersUseCase } from './application/use-cases/find-users/find-users.use-case';
import { DeleteUserUseCase } from './application/use-cases/delete-user/delete-user.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'apps/user-service/.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('USER_DB_HOST', 'localhost'),
        port: config.get<number>('USER_DB_PORT', 5432),
        user: config.get<string>('USER_DB_USER', 'cosmetic'),
        password: config.get<string>('USER_DB_PASSWORD', 'cosmetic'),
        dbName: config.get<string>('USER_DB_NAME', 'cosmetic_user_service'),
        entities: [User],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([User]),
    UuidModule,
  ],
  controllers: [UsersController],
  providers: [
    FindUserByIdUseCase,
    FindUsersUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    UserUniquenessService,
    {
      provide: USERS_QUERY_REPOSITORY,
      useClass: MikroUsersQueryRepository,
    },
    {
      provide: USERS_COMMAND_REPOSITORY,
      useClass: MikroUsersCommandRepository,
    },
    {
      provide: CREATE_USER_ID_PORT,
      useClass: CreateUserUuidAdapter,
    },
  ],
})
export class UserServiceModule {}
