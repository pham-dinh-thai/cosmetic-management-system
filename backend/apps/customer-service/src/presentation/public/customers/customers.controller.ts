import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { Audit, AuditAction, paramId, responseId, userSubId } from '@app/audit-client';
import { FindAllCustomersUseCase } from 'apps/customer-service/src/application/use-cases/find-customer/find-all/find-all-customers.use-case';
import { FindAllCustomerReadModel } from 'apps/customer-service/src/application/use-cases/find-customer/find-all/read-models/find-all-customer.read-model';
import { FindCustomerByIdUseCase } from 'apps/customer-service/src/application/use-cases/find-customer/find-by-id/find-customer-by-id.use-case';
import { FindCustomerByIdReadModel } from 'apps/customer-service/src/application/use-cases/find-customer/find-by-id/read-models/find-customer-by-id.read-model';
import { FindCustomerByUserUseCase } from 'apps/customer-service/src/application/use-cases/find-customer/find-by-user/find-customer-by-user.use-case';
import { FindCustomerByUserReadModel } from 'apps/customer-service/src/application/use-cases/find-customer/find-by-user/read-models/find-customer-by-user.read-model';
import { CreateCustomerUseCase } from 'apps/customer-service/src/application/use-cases/create-customer/create-customer.use-case';
import { CreateCustomerRequest } from './requests/create-customer.request';
import { UpdateCustomerUseCase } from 'apps/customer-service/src/application/use-cases/update-customer/update-customer.use-case';
import { UpdateCustomerRequest } from './requests/update-customer.request';
import { DeleteCustomerUseCase } from 'apps/customer-service/src/application/use-cases/delete-customer/delete-customer.use-case';
import { AddAddressUseCase } from 'apps/customer-service/src/application/use-cases/add-address/add-address.use-case';
import { AddAddressRequest } from './requests/add-address.request';
import { RemoveAddressUseCase } from 'apps/customer-service/src/application/use-cases/remove-address/remove-address.use-case';
import { AddPhoneUseCase } from 'apps/customer-service/src/application/use-cases/add-phone/add-phone.use-case';
import { AddPhoneRequest } from './requests/add-phone.request';
import { RemovePhoneUseCase } from 'apps/customer-service/src/application/use-cases/remove-phone/remove-phone.use-case';
import { ActivateCustomerUseCase } from 'apps/customer-service/src/application/use-cases/activate-customer/activate-customer.use-case';
import { DeactivateCustomerUseCase } from 'apps/customer-service/src/application/use-cases/deactivate-customer/deactivate-customer.use-case';
import { CustomerNotFoundException } from 'apps/customer-service/src/domain/exceptions/customer-not-found.exception';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin, Role.Employee)
@Controller('customers')
export class CustomersController {
  public constructor(
    private readonly findAllCustomersUseCase: FindAllCustomersUseCase,
    private readonly findCustomerByIdUseCase: FindCustomerByIdUseCase,
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly updateCustomerUseCase: UpdateCustomerUseCase,
    private readonly deleteCustomerUseCase: DeleteCustomerUseCase,
    private readonly addAddressUseCase: AddAddressUseCase,
    private readonly removeAddressUseCase: RemoveAddressUseCase,
    private readonly addPhoneUseCase: AddPhoneUseCase,
    private readonly removePhoneUseCase: RemovePhoneUseCase,
    private readonly activateCustomerUseCase: ActivateCustomerUseCase,
    private readonly deactivateCustomerUseCase: DeactivateCustomerUseCase,
    private readonly findCustomerByUserUseCase: FindCustomerByUserUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query('search') search?: string,
  ): Promise<FindAllCustomerReadModel[]> {
    return await this.findAllCustomersUseCase.execute(search);
  }

  @Roles(Role.Customer, Role.Admin, Role.Employee)
  @Get('me')
  public async findMe(
    @Req() request: Request,
  ): Promise<FindCustomerByIdReadModel | null> {
    const userId =
      (request as unknown as { user?: { sub?: string } }).user?.sub ?? '';
    if (!userId) {
      return null;
    }

    const customer = await this.findCustomerByUserUseCase.execute(userId);
    if (!customer) {
      return null;
    }

    return await this.findCustomerByIdUseCase.execute(customer.id);
  }

  @Roles(Role.Customer, Role.Admin, Role.Employee)
  @Post('me')
  @Audit({
    entityType: 'customer',
    action: AuditAction.CREATE,
    entityId: userSubId(),
  })
  public async ensureMe(
    @Req() request: Request,
  ): Promise<FindCustomerByUserReadModel> {
    const userId =
      (request as unknown as { user?: { sub?: string } }).user?.sub ?? '';

    if (userId) {
      const existing = await this.findCustomerByUserUseCase.execute(userId);
      if (existing) {
        return existing;
      }
    }

    await this.createCustomerUseCase.execute({ userId });

    const customer = await this.findCustomerByUserUseCase.execute(userId);

    return (
      customer ?? {
        id: '',
        code: '',
      }
    );
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<FindCustomerByIdReadModel | null> {
    return await this.findCustomerByIdUseCase.execute(id);
  }

  @Post()
  @Audit({
    entityType: 'customer',
    action: AuditAction.CREATE,
    entityId: responseId(),
  })
  public async create(
    @Body() request: CreateCustomerRequest,
  ): Promise<{ id: string }> {
    return await this.createCustomerUseCase.execute(request);
  }

  @Roles(Role.Customer, Role.Admin, Role.Employee)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('me')
  @Audit({
    entityType: 'customer',
    action: AuditAction.UPDATE,
    entityId: userSubId(),
  })
  public async updateMe(
    @Req() request: Request,
    @Body() body: UpdateCustomerRequest,
  ): Promise<void> {
    const userId =
      (request as unknown as { user?: { sub?: string } }).user?.sub ?? '';

    const customer = await this.findCustomerByUserUseCase.execute(userId);

    if (!customer) {
      throw new CustomerNotFoundException(userId);
    }

    await this.updateCustomerUseCase.execute(customer.id, body);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put(':id')
  @Audit({
    entityType: 'customer',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async update(
    @Param('id') id: string,
    @Body() request: UpdateCustomerRequest,
  ): Promise<void> {
    await this.updateCustomerUseCase.execute(id, request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @Audit({
    entityType: 'customer',
    action: AuditAction.DELETE,
    entityId: paramId(),
  })
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteCustomerUseCase.execute(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/activate')
  @Audit({
    entityType: 'customer',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async activate(@Param('id') id: string): Promise<void> {
    await this.activateCustomerUseCase.execute(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/deactivate')
  @Audit({
    entityType: 'customer',
    action: AuditAction.UPDATE,
    entityId: paramId(),
  })
  public async deactivate(@Param('id') id: string): Promise<void> {
    await this.deactivateCustomerUseCase.execute(id);
  }

  @Post(':id/addresses')
  @Audit({
    entityType: 'customer-address',
    action: AuditAction.CREATE,
    entityId: paramId(),
  })
  public async addAddress(
    @Param('id') id: string,
    @Body() request: AddAddressRequest,
  ): Promise<void> {
    await this.addAddressUseCase.execute(id, request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/addresses/:addressId')
  @Audit({
    entityType: 'customer-address',
    action: AuditAction.DELETE,
    entityId: paramId('addressId'),
  })
  public async removeAddress(
    @Param('id') id: string,
    @Param('addressId') addressId: string,
  ): Promise<void> {
    await this.removeAddressUseCase.execute(id, addressId);
  }

  @Post(':id/phones')
  @Audit({
    entityType: 'customer-phone',
    action: AuditAction.CREATE,
    entityId: paramId(),
  })
  public async addPhone(
    @Param('id') id: string,
    @Body() request: AddPhoneRequest,
  ): Promise<void> {
    await this.addPhoneUseCase.execute(id, request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/phones/:phoneId')
  @Audit({
    entityType: 'customer-phone',
    action: AuditAction.DELETE,
    entityId: paramId('phoneId'),
  })
  public async removePhone(
    @Param('id') id: string,
    @Param('phoneId') phoneId: string,
  ): Promise<void> {
    await this.removePhoneUseCase.execute(id, phoneId);
  }
}
