import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateEmployeeUseCase } from 'apps/employee-service/src/application/use-cases/create-employee/create-employee.use-case';
import { CreateEmployeeRequest } from './requests/create-employee.request';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';

@Controller('employees')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
export class EmployeesController {
  public constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
  ) {}

  @Post()
  public async create(@Body() request: CreateEmployeeRequest): Promise<void> {
    await this.createEmployeeUseCase.execute(request);
  }
}
