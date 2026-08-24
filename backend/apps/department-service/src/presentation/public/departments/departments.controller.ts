import { Body, Controller, Post } from '@nestjs/common';
import { CreateDepartmentUseCase } from 'apps/department-service/src/application/use-cases/create-department/create-department.use-case';
import { CreateDepartmentRequest } from './requests/create-department.request';

@Controller('departments')
export class DepartmentsController {
  public constructor(
    private readonly createDepartmentUseCase: CreateDepartmentUseCase,
  ) {}

  @Post()
  public async create(@Body() request: CreateDepartmentRequest): Promise<void> {
    await this.createDepartmentUseCase.execute(request);
  }
}
