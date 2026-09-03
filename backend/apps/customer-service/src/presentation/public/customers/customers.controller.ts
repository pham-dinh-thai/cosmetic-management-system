import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { FindAllCustomersUseCase } from 'apps/customer-service/src/application/use-cases/find-customer/find-all/find-all-customers.use-case';
import { FindAllCustomerReadModel } from 'apps/customer-service/src/application/use-cases/find-customer/find-all/read-models/find-all-customer.read-model';
import { FindCustomerByIdUseCase } from 'apps/customer-service/src/application/use-cases/find-customer/find-by-id/find-customer-by-id.use-case';
import { FindCustomerByIdReadModel } from 'apps/customer-service/src/application/use-cases/find-customer/find-by-id/read-models/find-customer-by-id.read-model';
import { CreateCustomerUseCase } from 'apps/customer-service/src/application/use-cases/create-customer/create-customer.use-case';
import { CreateCustomerRequest } from './requests/create-customer.request';
import { AddAddressUseCase } from 'apps/customer-service/src/application/use-cases/add-address/add-address.use-case';
import { AddAddressRequest } from './requests/add-address.request';
import { RemoveAddressUseCase } from 'apps/customer-service/src/application/use-cases/remove-address/remove-address.use-case';
import { AddPhoneUseCase } from 'apps/customer-service/src/application/use-cases/add-phone/add-phone.use-case';
import { AddPhoneRequest } from './requests/add-phone.request';
import { RemovePhoneUseCase } from 'apps/customer-service/src/application/use-cases/remove-phone/remove-phone.use-case';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('customers')
export class CustomersController {
  public constructor(
    private readonly findAllCustomersUseCase: FindAllCustomersUseCase,
    private readonly findCustomerByIdUseCase: FindCustomerByIdUseCase,
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly addAddressUseCase: AddAddressUseCase,
    private readonly removeAddressUseCase: RemoveAddressUseCase,
    private readonly addPhoneUseCase: AddPhoneUseCase,
    private readonly removePhoneUseCase: RemovePhoneUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<FindAllCustomerReadModel[]> {
    return await this.findAllCustomersUseCase.execute();
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<FindCustomerByIdReadModel | null> {
    return await this.findCustomerByIdUseCase.execute(id);
  }

  @Post()
  public async create(
    @Body() request: CreateCustomerRequest,
  ): Promise<{ id: string }> {
    return await this.createCustomerUseCase.execute(request);
  }

  @Post(':id/addresses')
  public async addAddress(
    @Param('id') id: string,
    @Body() request: AddAddressRequest,
  ): Promise<void> {
    await this.addAddressUseCase.execute(id, request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/addresses/:addressId')
  public async removeAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
  ): Promise<void> {
    await this.removeAddressUseCase.execute(id, addressId);
  }

  @Post(':id/phones')
  public async addPhone(
    @Param('id') id: string,
    @Body() request: AddPhoneRequest,
  ): Promise<void> {
    await this.addPhoneUseCase.execute(id, request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/phones/:phoneId')
  public async removePhone(
    @Param('id') id: string,
    @Param('phoneId') phoneId: string,
  ): Promise<void> {
    await this.removePhoneUseCase.execute(id, phoneId);
  }
}
