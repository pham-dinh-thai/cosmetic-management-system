import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { DeleteCustomerUseCase } from 'apps/customer-service/src/application/use-cases/delete-customer/delete-customer.use-case';
import { CreateCustomerUseCase } from 'apps/customer-service/src/application/use-cases/create-customer/create-customer.use-case';
import { FindCustomerByUserUseCase } from 'apps/customer-service/src/application/use-cases/find-customer/find-by-user/find-customer-by-user.use-case';
import { FindCustomerByUserReadModel } from 'apps/customer-service/src/application/use-cases/find-customer/find-by-user/read-models/find-customer-by-user.read-model';
import { FindCustomerByIdUseCase } from 'apps/customer-service/src/application/use-cases/find-customer/find-by-id/find-customer-by-id.use-case';
import { FindCustomerByIdReadModel } from 'apps/customer-service/src/application/use-cases/find-customer/find-by-id/read-models/find-customer-by-id.read-model';
import { AddPhoneUseCase } from 'apps/customer-service/src/application/use-cases/add-phone/add-phone.use-case';
import { AddAddressUseCase } from 'apps/customer-service/src/application/use-cases/add-address/add-address.use-case';
import { CreateCustomerRequest } from './requests/create-customer.request';
import { AddPhoneRequest } from './requests/add-phone.request';
import { AddAddressRequest } from './requests/add-address.request';

@Controller('internal/customers')
export class InternalCustomersController {
  public constructor(
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findCustomerByUserUseCase: FindCustomerByUserUseCase,
    private readonly findCustomerByIdUseCase: FindCustomerByIdUseCase,
    private readonly addPhoneUseCase: AddPhoneUseCase,
    private readonly addAddressUseCase: AddAddressUseCase,
  ) {}

  @Get('by-user/:userId')
  public async findByUserId(
    @Param('userId') userId: string,
  ): Promise<FindCustomerByUserReadModel | null> {
    return await this.findCustomerByUserUseCase.execute(userId);
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':id/phones')
  public async addPhone(
    @Param('id') id: string,
    @Body() request: AddPhoneRequest,
  ): Promise<void> {
    await this.addPhoneUseCase.execute(id, request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post(':id/addresses')
  public async addAddress(
    @Param('id') id: string,
    @Body() request: AddAddressRequest,
  ): Promise<void> {
    await this.addAddressUseCase.execute(id, request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteCustomerUseCase.execute(id);
  }
}
