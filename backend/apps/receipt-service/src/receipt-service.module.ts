import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuditClientModule } from '@app/audit-client';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Receipt } from './infrastructure/entities/receipt.entity';
import { Payment } from './infrastructure/entities/payment.entity';
import { ReceiptsController } from './presentation/public/receipts/receipts.controller';
import { PaymentsController } from './presentation/public/payments/payments.controller';
import { InternalReceiptsController } from './presentation/internal/receipts/internal-receipts.controller';
import { InternalPaymentsController } from './presentation/internal/payments/internal-payments.controller';
import { DomainErrorFilter } from './presentation/filters/domain-error.filter';
import { RECEIPTS_REPOSITORY } from './domain/repositories/receipts.repository';
import { PAYMENTS_REPOSITORY } from './domain/repositories/payments.repository';
import { MikroReceiptsRepository } from './infrastructure/repositories/mikro-receipts.repository';
import { MikroPaymentsRepository } from './infrastructure/repositories/mikro-payments.repository';
import {
  CreateManualReceiptUseCase,
  createManualReceiptUseCaseFactory,
} from './application/use-cases/create-manual-receipt/create-manual-receipt.use-case';
import {
  CreateReceiptFromInvoicePaymentUseCase,
  createReceiptFromInvoicePaymentUseCaseFactory,
} from './application/use-cases/create-receipt-from-invoice-payment/create-receipt-from-invoice-payment.use-case';
import {
  CreateManualPaymentUseCase,
  createManualPaymentUseCaseFactory,
} from './application/use-cases/create-manual-payment/create-manual-payment.use-case';
import {
  CreatePaymentFromPurchaseUseCase,
  createPaymentFromPurchaseUseCaseFactory,
} from './application/use-cases/create-payment-from-purchase/create-payment-from-purchase.use-case';
import {
  FindAllReceiptsUseCase,
  findAllReceiptsUseCaseFactory,
} from './application/use-cases/find-all-receipts/find-all-receipts.use-case';
import {
  FindAllPaymentsUseCase,
  findAllPaymentsUseCaseFactory,
} from './application/use-cases/find-all-payments/find-all-payments.use-case';
import {
  FindReceiptByIdUseCase,
  findReceiptByIdUseCaseFactory,
} from './application/use-cases/find-receipt-by-id/find-receipt-by-id.use-case';
import {
  FindPaymentByIdUseCase,
  findPaymentByIdUseCaseFactory,
} from './application/use-cases/find-payment-by-id/find-payment-by-id.use-case';
import {
  UpdateReceiptNoteUseCase,
  updateReceiptNoteUseCaseFactory,
} from './application/use-cases/update-receipt/update-receipt.use-case';
import {
  UpdatePaymentNoteUseCase,
  updatePaymentNoteUseCaseFactory,
} from './application/use-cases/update-payment/update-payment.use-case';
import {
  DeleteReceiptUseCase,
  deleteReceiptUseCaseFactory,
} from './application/use-cases/delete-receipt/delete-receipt.use-case';
import {
  DeletePaymentUseCase,
  deletePaymentUseCaseFactory,
} from './application/use-cases/delete-payment/delete-payment.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    AuditClientModule,
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('RECEIPT_DB_HOST'),
        port: config.get<number>('RECEIPT_DB_PORT'),
        user: config.get<string>('RECEIPT_DB_USER'),
        password: config.get<string>('RECEIPT_DB_PASSWORD'),
        dbName: config.get<string>('RECEIPT_DB_NAME'),
        entities: [Receipt, Payment],
        allowGlobalContext: true,
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Receipt, Payment]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    ReceiptsController,
    PaymentsController,
    InternalReceiptsController,
    InternalPaymentsController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DomainErrorFilter,
    },
    {
      provide: RECEIPTS_REPOSITORY,
      useClass: MikroReceiptsRepository,
    },
    {
      provide: PAYMENTS_REPOSITORY,
      useClass: MikroPaymentsRepository,
    },
    {
      provide: CreateManualReceiptUseCase,
      useFactory: createManualReceiptUseCaseFactory,
      inject: [RECEIPTS_REPOSITORY],
    },
    {
      provide: CreateReceiptFromInvoicePaymentUseCase,
      useFactory: createReceiptFromInvoicePaymentUseCaseFactory,
      inject: [RECEIPTS_REPOSITORY],
    },
    {
      provide: CreateManualPaymentUseCase,
      useFactory: createManualPaymentUseCaseFactory,
      inject: [PAYMENTS_REPOSITORY],
    },
    {
      provide: CreatePaymentFromPurchaseUseCase,
      useFactory: createPaymentFromPurchaseUseCaseFactory,
      inject: [PAYMENTS_REPOSITORY],
    },
    {
      provide: FindAllReceiptsUseCase,
      useFactory: findAllReceiptsUseCaseFactory,
      inject: [RECEIPTS_REPOSITORY],
    },
    {
      provide: FindAllPaymentsUseCase,
      useFactory: findAllPaymentsUseCaseFactory,
      inject: [PAYMENTS_REPOSITORY],
    },
    {
      provide: FindReceiptByIdUseCase,
      useFactory: findReceiptByIdUseCaseFactory,
      inject: [RECEIPTS_REPOSITORY],
    },
    {
      provide: FindPaymentByIdUseCase,
      useFactory: findPaymentByIdUseCaseFactory,
      inject: [PAYMENTS_REPOSITORY],
    },
    {
      provide: UpdateReceiptNoteUseCase,
      useFactory: updateReceiptNoteUseCaseFactory,
      inject: [RECEIPTS_REPOSITORY],
    },
    {
      provide: UpdatePaymentNoteUseCase,
      useFactory: updatePaymentNoteUseCaseFactory,
      inject: [PAYMENTS_REPOSITORY],
    },
    {
      provide: DeleteReceiptUseCase,
      useFactory: deleteReceiptUseCaseFactory,
      inject: [RECEIPTS_REPOSITORY],
    },
    {
      provide: DeletePaymentUseCase,
      useFactory: deletePaymentUseCaseFactory,
      inject: [PAYMENTS_REPOSITORY],
    },
  ],
})
export class ReceiptServiceModule {}