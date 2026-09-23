import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { AuditLog } from './infrastructure/entities/audit-log.entity';
import { AuditLogsController } from './presentation/public/audit-logs/audit-logs.controller';
import { InternalAuditLogsController } from './presentation/internal/audit-logs/internal-audit-logs.controller';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';
import { AUDIT_LOGS_REPOSITORY } from './domain/repositories/audit-logs.repository';
import { MikroAuditLogsRepository } from './infrastructure/repositories/mikro-audit-logs.repository';
import {
  RecordAuditLogUseCase,
  recordAuditLogUseCaseFactory,
} from './application/use-cases/record-audit-log/record-audit-log.use-case';
import {
  FindAllAuditLogsUseCase,
  findAllAuditLogsUseCaseFactory,
} from './application/use-cases/find-all-audit-logs/find-all-audit-logs.use-case';
import {
  FindAuditLogByIdUseCase,
  findAuditLogByIdUseCaseFactory,
} from './application/use-cases/find-audit-log-by-id/find-audit-log-by-id.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('AUDIT_DB_HOST'),
        port: config.get<number>('AUDIT_DB_PORT'),
        user: config.get<string>('AUDIT_DB_USER'),
        password: config.get<string>('AUDIT_DB_PASSWORD'),
        dbName: config.get<string>('AUDIT_DB_NAME'),
        entities: [AuditLog],
        allowGlobalContext: true,
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([AuditLog]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuditLogsController, InternalAuditLogsController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainErrorFilter,
    },
    {
      provide: AUDIT_LOGS_REPOSITORY,
      useClass: MikroAuditLogsRepository,
    },
    {
      provide: RecordAuditLogUseCase,
      useFactory: recordAuditLogUseCaseFactory,
      inject: [AUDIT_LOGS_REPOSITORY],
    },
    {
      provide: FindAllAuditLogsUseCase,
      useFactory: findAllAuditLogsUseCaseFactory,
      inject: [AUDIT_LOGS_REPOSITORY],
    },
    {
      provide: FindAuditLogByIdUseCase,
      useFactory: findAuditLogByIdUseCaseFactory,
      inject: [AUDIT_LOGS_REPOSITORY],
    },
  ],
})
export class AuditServiceModule {}
