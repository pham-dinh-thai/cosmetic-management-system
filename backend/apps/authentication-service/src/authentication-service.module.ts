import { Module } from '@nestjs/common';
import { AuthenticationServiceController } from './authentication-service.controller';
import { AuthenticationServiceService } from './authentication-service.service';
import { AuthenticationController } from './presentation/authentication/authentication.controller';
import { UuidModule } from 'nestjs-uuid';
import { AuthUser } from './infrastructure/entities/auth-user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

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
  controllers: [AuthenticationServiceController, AuthenticationController],
  providers: [AuthenticationServiceService],
})
export class AuthenticationServiceModule {}
