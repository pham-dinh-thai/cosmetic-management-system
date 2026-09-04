import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Supplier } from './infrastructure/entities/supplier.entity';
import { SuppliersController } from './presentation/public/suppliers/suppliers.controller';
import { SUPPLIERS_REPOSITORY } from './domain/repositories/suppliers.repository';
import { MikroSuppliersRepository } from './infrastructure/repositories/mikro-suppliers.repository';
import {
  CreateSupplierUseCase,
  createSupplierUseCaseFactory,
} from './application/use-cases/create-supplier/create-supplier.use-case';
import {
  FindSupplierByIdUseCase,
  findSupplierByIdUseCaseFactory,
} from './application/use-cases/find-supplier/find-by-id/find-supplier-by-id.use-case';
import {
  FindAllSuppliersUseCase,
  findAllSuppliersUseCaseFactory,
} from './application/use-cases/find-supplier/find-all/find-all-suppliers.use-case';
import {
  UpdateSupplierUseCase,
  updateSupplierUseCaseFactory,
} from './application/use-cases/update-supplier/update-supplier.use-case';
import {
  ActivateSupplierUseCase,
  activateSupplierUseCaseFactory,
} from './application/use-cases/activate-supplier/activate-supplier.use-case';
import {
  DeactivateSupplierUseCase,
  deactivateSupplierUseCaseFactory,
} from './application/use-cases/deactivate-supplier/deactivate-supplier.use-case';
import {
  DeleteSupplierUseCase,
  deleteSupplierUseCaseFactory,
} from './application/use-cases/delete-supplier/delete-supplier.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('SUPPLIER_DB_HOST'),
        port: config.get<number>('SUPPLIER_DB_PORT'),
        user: config.get<string>('SUPPLIER_DB_USER'),
        password: config.get<string>('SUPPLIER_DB_PASSWORD'),
        dbName: config.get<string>('SUPPLIER_DB_NAME'),
        entities: [Supplier],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Supplier]),
  ],
  controllers: [SuppliersController],
  providers: [
    { provide: SUPPLIERS_REPOSITORY, useClass: MikroSuppliersRepository },
    {
      provide: CreateSupplierUseCase,
      useFactory: createSupplierUseCaseFactory,
      inject: [SUPPLIERS_REPOSITORY],
    },
    {
      provide: FindSupplierByIdUseCase,
      useFactory: findSupplierByIdUseCaseFactory,
      inject: [SUPPLIERS_REPOSITORY],
    },
    {
      provide: FindAllSuppliersUseCase,
      useFactory: findAllSuppliersUseCaseFactory,
      inject: [SUPPLIERS_REPOSITORY],
    },
    {
      provide: UpdateSupplierUseCase,
      useFactory: updateSupplierUseCaseFactory,
      inject: [SUPPLIERS_REPOSITORY],
    },
    {
      provide: ActivateSupplierUseCase,
      useFactory: activateSupplierUseCaseFactory,
      inject: [SUPPLIERS_REPOSITORY],
    },
    {
      provide: DeactivateSupplierUseCase,
      useFactory: deactivateSupplierUseCaseFactory,
      inject: [SUPPLIERS_REPOSITORY],
    },
    {
      provide: DeleteSupplierUseCase,
      useFactory: deleteSupplierUseCaseFactory,
      inject: [SUPPLIERS_REPOSITORY],
    },
  ],
})
export class SupplierServiceModule {}