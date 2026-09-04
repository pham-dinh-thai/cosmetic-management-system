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
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { FindAllSuppliersUseCase } from 'apps/supplier-service/src/application/use-cases/find-supplier/find-all/find-all-suppliers.use-case';
import { FindAllSupplierReadModel } from 'apps/supplier-service/src/application/use-cases/find-supplier/find-all/read-models/find-all-supplier.read-model';
import { FindSupplierByIdUseCase } from 'apps/supplier-service/src/application/use-cases/find-supplier/find-by-id/find-supplier-by-id.use-case';
import { FindSupplierByIdReadModel } from 'apps/supplier-service/src/application/use-cases/find-supplier/find-by-id/read-models/find-supplier-by-id.read-model';
import { CreateSupplierUseCase } from 'apps/supplier-service/src/application/use-cases/create-supplier/create-supplier.use-case';
import { UpdateSupplierUseCase } from 'apps/supplier-service/src/application/use-cases/update-supplier/update-supplier.use-case';
import { ActivateSupplierUseCase } from 'apps/supplier-service/src/application/use-cases/activate-supplier/activate-supplier.use-case';
import { DeactivateSupplierUseCase } from 'apps/supplier-service/src/application/use-cases/deactivate-supplier/deactivate-supplier.use-case';
import { DeleteSupplierUseCase } from 'apps/supplier-service/src/application/use-cases/delete-supplier/delete-supplier.use-case';
import { CreateSupplierRequest } from './requests/create-supplier.request';
import { UpdateSupplierRequest } from './requests/update-supplier.request';

@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('suppliers')
export class SuppliersController {
  public constructor(
    private readonly findAllSuppliersUseCase: FindAllSuppliersUseCase,
    private readonly findSupplierByIdUseCase: FindSupplierByIdUseCase,
    private readonly createSupplierUseCase: CreateSupplierUseCase,
    private readonly updateSupplierUseCase: UpdateSupplierUseCase,
    private readonly activateSupplierUseCase: ActivateSupplierUseCase,
    private readonly deactivateSupplierUseCase: DeactivateSupplierUseCase,
    private readonly deleteSupplierUseCase: DeleteSupplierUseCase,
  ) {}

  @Get()
  public async findAll(
    @Query('search') search?: string,
  ): Promise<FindAllSupplierReadModel[]> {
    return await this.findAllSuppliersUseCase.execute(search);
  }

  @Get(':id')
  public async findById(
    @Param('id') id: string,
  ): Promise<FindSupplierByIdReadModel | null> {
    return await this.findSupplierByIdUseCase.execute(id);
  }

  @Post()
  public async create(
    @Body() request: CreateSupplierRequest,
  ): Promise<{ id: string }> {
    return await this.createSupplierUseCase.execute(request);
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() request: UpdateSupplierRequest,
  ): Promise<void> {
    await this.updateSupplierUseCase.execute(id, request);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/activate')
  public async activate(@Param('id') id: string): Promise<void> {
    await this.activateSupplierUseCase.execute(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/deactivate')
  public async deactivate(@Param('id') id: string): Promise<void> {
    await this.deactivateSupplierUseCase.execute(id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.deleteSupplierUseCase.execute(id);
  }
}
