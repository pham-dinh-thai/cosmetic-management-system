import { Module } from '@nestjs/common';
import { AuthorizationServiceController } from './authorization-service.controller';
import { AuthorizationServiceService } from './authorization-service.service';
import { RolesController } from './presentation/roles/roles.controller';
import { ROLES_REPOSITORY } from './domain/roles.repository';
import { MikroRolesRepository } from './infrastructure/repositories/mikro-roles.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Role } from './infrastructure/entities/role.entity';
import { CreateRoleUseCase } from './application/use-cases/create-role/create-role.use-case';

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
  ],
  controllers: [AuthorizationServiceController, RolesController],
  providers: [
    AuthorizationServiceService,
    {
      provide: ROLES_REPOSITORY,
      useClass: MikroRolesRepository,
    },
    CreateRoleUseCase,
  ],
})
export class AuthorizationServiceModule {}
