import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { CUSTOMER_CONTACT_READER_PORT } from './application/ports/customer-contact-reader.port';
import { MAIL_SENDER_PORT } from './application/ports/mail-sender.port';
import {
  FindEmailLogsUseCase,
  findEmailLogsUseCaseFactory,
} from './application/use-cases/find-email-logs/find-email-logs.use-case';
import {
  SendOrderEventMailUseCase,
  sendOrderEventMailUseCaseFactory,
} from './application/use-cases/send-order-event-mail/send-order-event-mail.use-case';
import { EMAIL_LOGS_REPOSITORY } from './domain/repositories/email-logs.repository';
import { CustomerContactReaderAdapter } from './infrastructure/adapters/customer-contact-reader.adapter';
import { ResendMailSenderAdapter } from './infrastructure/adapters/resend-mail-sender.adapter';
import { EmailLog } from './infrastructure/entities/email-log.entity';
import { OrderEventWorker } from './infrastructure/queue/order-event.worker';
import { MikroEmailLogsRepository } from './infrastructure/repositories/mikro-email-logs.repository';
import { InternalEmailLogsController } from './presentation/internal/email-logs/internal-email-logs.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('NOTIFICATION_DB_HOST'),
        port: config.get<number>('NOTIFICATION_DB_PORT'),
        user: config.get<string>('NOTIFICATION_DB_USER'),
        password: config.get<string>('NOTIFICATION_DB_PASSWORD'),
        dbName: config.get<string>('NOTIFICATION_DB_NAME'),
        entities: [EmailLog],
        allowGlobalContext: true,
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([EmailLog]),
  ],
  controllers: [InternalEmailLogsController],
  providers: [
    {
      provide: EMAIL_LOGS_REPOSITORY,
      useClass: MikroEmailLogsRepository,
    },
    {
      provide: CUSTOMER_CONTACT_READER_PORT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new CustomerContactReaderAdapter(config),
    },
    {
      provide: MAIL_SENDER_PORT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new ResendMailSenderAdapter(config),
    },
    {
      provide: SendOrderEventMailUseCase,
      useFactory: sendOrderEventMailUseCaseFactory,
      inject: [
        EMAIL_LOGS_REPOSITORY,
        CUSTOMER_CONTACT_READER_PORT,
        MAIL_SENDER_PORT,
      ],
    },
    {
      provide: FindEmailLogsUseCase,
      useFactory: findEmailLogsUseCaseFactory,
      inject: [EMAIL_LOGS_REPOSITORY],
    },
    OrderEventWorker,
  ],
})
export class NotificationServiceModule {}
