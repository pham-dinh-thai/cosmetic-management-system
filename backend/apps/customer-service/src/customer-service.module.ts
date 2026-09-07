import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { Customer } from './infrastructure/entities/customer.entity';
import { Address } from './infrastructure/entities/address.entity';
import { Phone } from './infrastructure/entities/phone.entity';
import { CustomersController } from './presentation/public/customers/customers.controller';
import { InternalCustomersController } from './presentation/internal/customers/customers.controller';
import { CUSTOMERS_REPOSITORY } from './domain/repositories/customers.repository';
import { MikroCustomersRepository } from './infrastructure/repositories/mikro-customers.repository';
import {
  CreateCustomerUseCase,
  createCustomerUseCaseFactory,
} from './application/use-cases/create-customer/create-customer.use-case';
import { CREATE_USER_PORT } from './application/use-cases/create-customer/ports/create-user.port';
import { CreateUserAdapter } from './infrastructure/adapters/create-user.adapter';
import { DELETE_USER_PORT } from './application/use-cases/create-customer/ports/delete-user.port';
import { DeleteUserAdapter } from './infrastructure/adapters/delete-user.adapter';
import { UPDATE_USER_INFORMATION_PORT } from './application/use-cases/update-customer/ports/update-user-information.port';
import { FIND_USER_INFORMATION_PORT } from './application/use-cases/update-customer/ports/find-user-information.port';
import {
  UpdateUserInformationAdapter,
  FindUserInformationAdapter,
} from './infrastructure/adapters/user-information.adapter';
import {
  UpdateCustomerUseCase,
  updateCustomerUseCaseFactory,
} from './application/use-cases/update-customer/update-customer.use-case';
import {
  FindCustomerByIdUseCase,
  findCustomerByIdUseCaseFactory,
} from './application/use-cases/find-customer/find-by-id/find-customer-by-id.use-case';
import {
  FindCustomerByUserUseCase,
  findCustomerByUserUseCaseFactory,
} from './application/use-cases/find-customer/find-by-user/find-customer-by-user.use-case';
import {
  FindAllCustomersUseCase,
  findAllCustomersUseCaseFactory,
} from './application/use-cases/find-customer/find-all/find-all-customers.use-case';
import {
  DeleteCustomerUseCase,
  deleteCustomerUseCaseFactory,
} from './application/use-cases/delete-customer/delete-customer.use-case';
import {
  AddAddressUseCase,
  addAddressUseCaseFactory,
} from './application/use-cases/add-address/add-address.use-case';
import {
  RemoveAddressUseCase,
  removeAddressUseCaseFactory,
} from './application/use-cases/remove-address/remove-address.use-case';
import {
  AddPhoneUseCase,
  addPhoneUseCaseFactory,
} from './application/use-cases/add-phone/add-phone.use-case';
import {
  RemovePhoneUseCase,
  removePhoneUseCaseFactory,
} from './application/use-cases/remove-phone/remove-phone.use-case';
import { PhoneValidationService } from './domain/services/phone-validation.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      useFactory: (config: ConfigService) => ({
        host: config.get<string>('CUSTOMER_DB_HOST'),
        port: config.get<number>('CUSTOMER_DB_PORT'),
        user: config.get<string>('CUSTOMER_DB_USER'),
        password: config.get<string>('CUSTOMER_DB_PASSWORD'),
        dbName: config.get<string>('CUSTOMER_DB_NAME'),
        entities: [Customer, Address, Phone],
      }),
      inject: [ConfigService],
    }),
    MikroOrmModule.forFeature([Customer, Address, Phone]),
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CustomersController, InternalCustomersController],
  providers: [
    { provide: CUSTOMERS_REPOSITORY, useClass: MikroCustomersRepository },
    {
      provide: CREATE_USER_PORT,
      useFactory: (config: ConfigService) => new CreateUserAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: DELETE_USER_PORT,
      useFactory: (config: ConfigService) => new DeleteUserAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: UPDATE_USER_INFORMATION_PORT,
      useFactory: (config: ConfigService) =>
        new UpdateUserInformationAdapter(config),
      inject: [ConfigService],
    },
    {
      provide: FIND_USER_INFORMATION_PORT,
      useFactory: (config: ConfigService) =>
        new FindUserInformationAdapter(config),
      inject: [ConfigService],
    },
    PhoneValidationService,
    {
      provide: CreateCustomerUseCase,
      useFactory: createCustomerUseCaseFactory,
      inject: [CREATE_USER_PORT, CUSTOMERS_REPOSITORY, DELETE_USER_PORT],
    },
    {
      provide: UpdateCustomerUseCase,
      useFactory: updateCustomerUseCaseFactory,
      inject: [
        CUSTOMERS_REPOSITORY,
        UPDATE_USER_INFORMATION_PORT,
        FIND_USER_INFORMATION_PORT,
      ],
    },
    {
      provide: FindCustomerByIdUseCase,
      useFactory: findCustomerByIdUseCaseFactory,
      inject: [CUSTOMERS_REPOSITORY, FIND_USER_INFORMATION_PORT],
    },
    {
      provide: FindCustomerByUserUseCase,
      useFactory: findCustomerByUserUseCaseFactory,
      inject: [CUSTOMERS_REPOSITORY],
    },
    {
      provide: FindAllCustomersUseCase,
      useFactory: findAllCustomersUseCaseFactory,
      inject: [CUSTOMERS_REPOSITORY, FIND_USER_INFORMATION_PORT],
    },
    {
      provide: DeleteCustomerUseCase,
      useFactory: deleteCustomerUseCaseFactory,
      inject: [CUSTOMERS_REPOSITORY],
    },
    {
      provide: AddAddressUseCase,
      useFactory: addAddressUseCaseFactory,
      inject: [CUSTOMERS_REPOSITORY],
    },
    {
      provide: RemoveAddressUseCase,
      useFactory: removeAddressUseCaseFactory,
      inject: [CUSTOMERS_REPOSITORY],
    },
    {
      provide: AddPhoneUseCase,
      useFactory: addPhoneUseCaseFactory,
      inject: [CUSTOMERS_REPOSITORY, PhoneValidationService],
    },
    {
      provide: RemovePhoneUseCase,
      useFactory: removePhoneUseCaseFactory,
      inject: [CUSTOMERS_REPOSITORY],
    },
  ],
})
export class CustomerServiceModule {}
