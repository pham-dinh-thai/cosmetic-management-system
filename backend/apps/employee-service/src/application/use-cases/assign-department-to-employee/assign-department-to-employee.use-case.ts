import { EmployeeNotFoundException } from 'apps/employee-service/src/domain/exceptions/employee-not-found.exception';
import { IEmployeesRepository } from 'apps/employee-service/src/domain/repositories/employees.repository';
import { IAssignDepartmentToEmployeeRequest } from './assign-department-to-employee.request';
import { IDepartmentsReaderPort } from '../../ports/departments-reader.port';
import { DepartmentNotFoundException } from 'apps/employee-service/src/domain/exceptions/department-not-found.exception';

export class AssignDepartmentToEmployeeUseCase {
  public constructor(
    private readonly employeesRepository: IEmployeesRepository,
    private readonly departmentsReaderPort: IDepartmentsReaderPort,
  ) {}

  public async execute(
    id: string,
    request: IAssignDepartmentToEmployeeRequest,
  ): Promise<void> {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new EmployeeNotFoundException(id);
    }

    const department = await this.departmentsReaderPort.findById(
      request.departmentId,
    );

    if (!department) {
      throw new DepartmentNotFoundException(request.departmentId);
    }

    employee.assignDepartment(department.id);

    await this.employeesRepository.assignDepartment(employee);
  }
}

export const assignDepartmentToEmployeeUseCaseFactory = (
  employeesRepository: IEmployeesRepository,
  departmentsReaderPort: IDepartmentsReaderPort,
): AssignDepartmentToEmployeeUseCase =>
  new AssignDepartmentToEmployeeUseCase(
    employeesRepository,
    departmentsReaderPort,
  );
