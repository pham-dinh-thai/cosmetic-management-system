import { ICreateUserPort } from './ports/create-user.port';
import { ICreateEmployeeRequest } from './create-employee.request';
import { Employee } from 'apps/employee-service/src/domain/employee.aggregate';
import { IEmployeesRepository } from 'apps/employee-service/src/domain/repositories/employees.repository';
import { IDepartmentsReaderPort } from 'apps/employee-service/src/application/ports/departments-reader.port';
import { DepartmentNotFoundException } from 'apps/employee-service/src/domain/exceptions/department-not-found.exception';
import { EmployeeCode } from 'apps/employee-service/src/domain/value-objects/employee-code.value-object';
import { IDeleteUserPort } from '../delete-employee/ports/delete-user.port';
import { IEmployeeLoggerPort } from '../../ports/employee-logger.port';

export class CreateEmployeeUseCase {
  public constructor(
    private readonly createUserPort: ICreateUserPort,
    private readonly employeesRepository: IEmployeesRepository,
    private readonly departmentsReaderPort: IDepartmentsReaderPort,
    private readonly deleteUserPort: IDeleteUserPort,
    private readonly logger: IEmployeeLoggerPort,
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

    try {
      const code = EmployeeCode.generate(
        (await this.employeesRepository.count()) + 1,
      );

      const employee = Employee.create({
        userId: user.id,
        code,
        departmentId: request.departmentId,
        hiredAt: new Date(request.hiredAt),
        position: request.position,
        phone: request.phone,
        address: request.address,
      });

      await this.employeesRepository.create(employee);
    } catch (error) {
      await this.rollbackUser(user.id);
      throw error;
    }
  }

  private async rollbackUser(userId: string): Promise<void> {
    const isUserDeleted = await this.deleteUserPort.execute(userId);

    if (!isUserDeleted) {
      this.logger.error(
        `Failed to delete user ${userId} during create-employee compensation`,
      );
    }
  }
}

export const createEmployeeUseCaseFactory = (
  createUserPort: ICreateUserPort,
  employeesRepository: IEmployeesRepository,
  departmentsReaderPort: IDepartmentsReaderPort,
  deleteUserPort: IDeleteUserPort,
  logger: IEmployeeLoggerPort,
): CreateEmployeeUseCase =>
  new CreateEmployeeUseCase(
    createUserPort,
    employeesRepository,
    departmentsReaderPort,
    deleteUserPort,
    logger,
  );
