import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateDepartmentUseCase } from 'apps/department-service/src/application/use-cases/create-department/create-department.use-case';
import { CreateDepartmentRequest } from './requests/create-department.request';
import { FindDepartmentsUseCase } from 'apps/department-service/src/application/use-cases/find-departments/find-departments.use-case';
import { DepartmentReadModel } from 'apps/department-service/src/domain/read-models/department.read-model';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { UpdateDepartmentUseCase } from 'apps/department-service/src/application/use-cases/update-department/update-department.use-case';
import { UpdateDepartmentRequest } from './requests/update-department.request';
import { DeactivateDepartmentUseCase } from 'apps/department-service/src/application/use-cases/deactivate-department/deactivate-department.use-case';
import { ActivateDepartmentUseCase } from 'apps/department-service/src/application/use-cases/activate-department/activate-department.use-case';

@Controller('departments')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
export class DepartmentsController {
  public constructor(
    private readonly findDepartmentsUseCase: FindDepartmentsUseCase,
    private readonly createDepartmentUseCase: CreateDepartmentUseCase,
    private readonly updateDepartmentUseCase: UpdateDepartmentUseCase,
    private readonly deactivateDepartmentUseCase: DeactivateDepartmentUseCase,
    private readonly activateDepartmentUseCase: ActivateDepartmentUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<DepartmentReadModel[]> {
    return await this.findDepartmentsUseCase.execute();
  }

  @Post()
  public async create(@Body() request: CreateDepartmentRequest): Promise<void> {
    await this.createDepartmentUseCase.execute(request);
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() request: UpdateDepartmentRequest,
  ): Promise<void> {
    await this.updateDepartmentUseCase.execute(id, request);
  }

  @Patch(':id/deactivate')
  public async deactivate(@Param('id') id: string): Promise<void> {
    await this.deactivateDepartmentUseCase.execute(id);
  }

  @Patch(':id/activate')
  public async activate(@Param('id') id: string): Promise<void> {
    await this.activateDepartmentUseCase.execute(id);
  }
}
