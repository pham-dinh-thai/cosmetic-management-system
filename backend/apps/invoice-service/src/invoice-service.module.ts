import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { RabbitmqModule } from '@app/rabbitmq';
import { Invoice } from './infrastructure/entities/invoice.entity';
import { InvoicesController } from './presentation/public/invoices/invoices.controller';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';
import { INVOICES_REPOSITORY } from './domain/repositories/invoices.repository';
import { MikroInvoicesRepository } from './infrastructure/repositories/mikro-invoices.repository';
import { OrderCompletedConsumer } from './infrastructure/events/order-completed.consumer';
import {
  CreateInvoiceFromOrderUseCase,
  createInvoiceFromOrderUseCaseFactory,
} from './application/use-cases/create-invoice-from-order/create-invoice-from-order.use-case';
import {
  FindAllInvoicesUseCase,
  findAllInvoicesUseCaseFactory,
} from './application/use-cases/find-all-invoices/find-all-invoices.use-case';
import {
  FindInvoiceByIdUseCase,
  findInvoiceByIdUseCaseFactory,
} from './application/use-cases/find-invoice-by-id/find-invoice-by-id.use-case';
import {
  RecordPaymentUseCase,
  recordPaymentUseCaseFactory,
} from './application/use-cases/record-payment/record-payment.use-case';
import {
  UpdateInvoiceUseCase,
  updateInvoiceUseCaseFactory,
} from './application/use-cases/update-invoice/update-invoice.use-case';
import {
  DeleteInvoiceUseCase,
  deleteInvoiceUseCaseFactory,
} from './application/use-cases/delete-invoice/delete-invoice.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    RabbitmqModule,
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('INVOICE_DB_HOST'),
        port: config.get<number>('INVOICE_DB_PORT'),
        user: config.get<string>('INVOICE_DB_USER'),
        password: config.get<string>('INVOICE_DB_PASSWORD'),
        dbName: config.get<string>('INVOICE_DB_NAME'),
        entities: [Invoice],
        allowGlobalContext: true,
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Invoice]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [InvoicesController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainErrorFilter,
    },
    {
      provide: INVOICES_REPOSITORY,
      useClass: MikroInvoicesRepository,
    },
    {
      provide: CreateInvoiceFromOrderUseCase,
      useFactory: createInvoiceFromOrderUseCaseFactory,
      inject: [INVOICES_REPOSITORY],
    },
    {
      provide: FindAllInvoicesUseCase,
      useFactory: findAllInvoicesUseCaseFactory,
      inject: [INVOICES_REPOSITORY],
    },
    {
      provide: FindInvoiceByIdUseCase,
      useFactory: findInvoiceByIdUseCaseFactory,
      inject: [INVOICES_REPOSITORY],
    },
    {
      provide: RecordPaymentUseCase,
      useFactory: recordPaymentUseCaseFactory,
      inject: [INVOICES_REPOSITORY],
    },
    {
      provide: UpdateInvoiceUseCase,
      useFactory: updateInvoiceUseCaseFactory,
      inject: [INVOICES_REPOSITORY],
    },
    {
      provide: DeleteInvoiceUseCase,
      useFactory: deleteInvoiceUseCaseFactory,
      inject: [INVOICES_REPOSITORY],
    },
    OrderCompletedConsumer,
  ],
})
export class InvoiceServiceModule {}
