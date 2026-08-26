import { Inject, Injectable } from '@nestjs/common';
import {
  CREATE_USER_PORT,
  type ICreateUserPort,
} from '../../ports/create-user.port';
import { ICreateEmployeeRequest } from './create-employee.request';
import { Employee } from 'apps/employee-service/src/domain/employee.aggregate';
import {
  EMPLOYEES_REPOSITORY,
  type IEmployeesRepository,
} from 'apps/employee-service/src/domain/repositories/employees.repository';
import { EnsureDepartmentExistsService } from 'apps/employee-service/src/domain/services/ensure-department-exists.service';

@Injectable()
export class CreateEmployeeUseCase {
  public constructor(
    @Inject(CREATE_USER_PORT)
    private readonly createUserPort: ICreateUserPort,

    @Inject(EMPLOYEES_REPOSITORY)
    private readonly employeesRepository: IEmployeesRepository,

    private readonly ensureDepartmentExistsService: EnsureDepartmentExistsService,
  ) {}

  public async execute(request: ICreateEmployeeRequest): Promise<void> {
    await this.ensureDepartmentExistsService.byId(request.departmentId);

    const user = await this.createUserPort.execute({
      firstName: request.user.firstName,
      lastName: request.user.lastName,
      gender: request.user.gender,
      email: request.user.email,
      password: request.user.password,
      roleId: request.user.roleId,
    });

    const employee = Employee.create({
      userId: user.id,
      code: request.code,
      departmentId: request.departmentId,
      hiredAt: new Date(request.hiredAt),
      position: request.position,
      phone: request.phone,
      address: request.address,
    });

    await this.employeesRepository.create(employee);
  }
}
