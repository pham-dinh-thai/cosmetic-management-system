import {
  CREATE_USER_PORT,
  type ICreateUserPort,
} from './ports/create-user.port';
import { ICreateEmployeeRequest } from './create-employee.request';
import { Employee } from 'apps/employee-service/src/domain/employee.aggregate';
import {
  EMPLOYEES_REPOSITORY,
  type IEmployeesRepository,
} from 'apps/employee-service/src/domain/repositories/employees.repository';
import {
  DEPARTMENTS_READER_PORT,
  type IDepartmentsReaderPort,
} from 'apps/employee-service/src/application/ports/departments-reader.port';
import { DepartmentNotFoundException } from 'apps/employee-service/src/domain/exceptions/department-not-found.exception';

export class CreateEmployeeUseCase {
  public constructor(
    private readonly createUserPort: ICreateUserPort,
    private readonly employeesRepository: IEmployeesRepository,
    private readonly departmentsReaderPort: IDepartmentsReaderPort,
  ) {}

  public async execute(request: ICreateEmployeeRequest): Promise<void> {
    const department = await this.departmentsReaderPort.findById(
      request.departmentId,
    );

    if (!department) {
      throw new DepartmentNotFoundException(request.departmentId);
    }

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

export const createEmployeeUseCaseFactory = (
  createUserPort: ICreateUserPort,
  employeesRepository: IEmployeesRepository,
  departmentsReaderPort: IDepartmentsReaderPort,
): CreateEmployeeUseCase =>
  new CreateEmployeeUseCase(
    createUserPort,
    employeesRepository,
    departmentsReaderPort,
  );
