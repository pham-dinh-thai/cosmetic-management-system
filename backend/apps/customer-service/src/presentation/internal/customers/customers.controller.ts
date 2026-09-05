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
import { CreateCustomerRequest } from './requests/create-customer.request';

@Controller('internal/customers')
export class InternalCustomersController {
  public constructor(
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly findCustomerByUserUseCase: FindCustomerByUserUseCase,
  ) {}

  @Get('by-user/:userId')
  public async findByUserId(
    @Param('userId') userId: string,
  ): Promise<FindCustomerByUserReadModel | null> {
    return await this.findCustomerByUserUseCase.execute(userId);
  }

  @Post()
  public async create(
    @Body() request: CreateCustomerRequest,
  ): Promise<{ id: string }> {
    return await this.createCustomerUseCase.execute(request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteCustomerUseCase.execute(id);
  }
}
