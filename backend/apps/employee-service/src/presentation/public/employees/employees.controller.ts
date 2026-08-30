import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateEmployeeUseCase } from 'apps/employee-service/src/application/use-cases/create-employee/create-employee.use-case';
import { UpdateEmployeeInformationUseCase } from 'apps/employee-service/src/application/use-cases/update-employee-information/update-employee-information.use-case';
import { CreateEmployeeRequest } from './requests/create-employee.request';
import { UpdateEmployeeInformationRequest } from './requests/update-employee-information.request';
import { AuthGuard, Role, Roles, RolesGuard } from '@app/security';
import { AssignDepartmentToEmployeeUseCase } from 'apps/employee-service/src/application/use-cases/assign-department-to-employee/assign-department-to-employee.use-case';
import { AssignDepartmentToEmployeeRequest } from './requests/assign-department-to-employee.request';
import { UpdateEmployeePositionUseCase } from 'apps/employee-service/src/application/use-cases/update-employee-position/update-employee-position.use-case';
import { UpdateEmployeePositionRequest } from './requests/update-employee-position.request';

@Controller('employees')
@UseGuards(AuthGuard, RolesGuard)
@Roles(Role.Admin)
export class EmployeesController {
  public constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    private readonly updateEmployeeInformationUseCase: UpdateEmployeeInformationUseCase,
    private readonly assignDepartmentToEmployeeUseCase: AssignDepartmentToEmployeeUseCase,
    private readonly updateEmployeePositionUseCase: UpdateEmployeePositionUseCase,
  ) {}

  @Post()
  public async create(@Body() request: CreateEmployeeRequest): Promise<void> {
    await this.createEmployeeUseCase.execute(request);
  }

  @Patch(':id')
  public async updateInformation(
    @Param('id') id: string,
    @Body() request: UpdateEmployeeInformationRequest,
  ): Promise<void> {
    await this.updateEmployeeInformationUseCase.execute(id, request);
  }

  @Patch(':id/department')
  public async assignDepartment(
    @Param('id') id: string,
    @Body() request: AssignDepartmentToEmployeeRequest,
  ): Promise<void> {
    await this.assignDepartmentToEmployeeUseCase.execute(id, request);
  }

  @Patch(':id/position')
  public async updatePosition(
    @Param('id') id: string,
    @Body() request: UpdateEmployeePositionRequest,
  ): Promise<void> {
    await this.updateEmployeePositionUseCase.execute(id, request);
  }
}
