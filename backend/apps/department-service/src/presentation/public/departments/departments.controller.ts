import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateDepartmentUseCase } from 'apps/department-service/src/application/use-cases/create-department/create-department.use-case';
import { CreateDepartmentRequest } from './requests/create-department.request';
import { FindDepartmentsUseCase } from 'apps/department-service/src/application/use-cases/find-departments/find-departments.use-case';
import { DepartmentReadModel } from 'apps/department-service/src/domain/read-models/department.read-model';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';

@Controller('departments')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
export class DepartmentsController {
  public constructor(
    private readonly findDepartmentsUseCase: FindDepartmentsUseCase,
    private readonly createDepartmentUseCase: CreateDepartmentUseCase,
  ) {}

  @Get()
  public async findAll(): Promise<DepartmentReadModel[]> {
    return await this.findDepartmentsUseCase.execute();
  }

  @Post()
  public async create(@Body() request: CreateDepartmentRequest): Promise<void> {
    await this.createDepartmentUseCase.execute(request);
  }
}
