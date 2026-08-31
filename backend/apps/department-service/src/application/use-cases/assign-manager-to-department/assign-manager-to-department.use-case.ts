import { IDepartmentsRepository } from 'apps/department-service/src/domain/repositories/departments.repository';
import { IAssignManagerToDepartmentRequest } from './assign-manager-to-department.request';
import { DepartmentNotFoundException } from 'apps/department-service/src/domain/exceptions/department-not-found.exception';
import { IEmployeeReaderPort } from './ports/employee-reader.port';
import { EmployeeNotFoundException } from 'apps/department-service/src/domain/exceptions/employee-not-found.exception';
import { EmployeeNotInDepartmentException } from 'apps/department-service/src/domain/exceptions/employee-not-in-department.exception';

export class AssignManagerToDepartmentUseCase {
  public constructor(
    private readonly departmentsRepository: IDepartmentsRepository,
    private readonly employeeReaderPort: IEmployeeReaderPort,
  ) {}

  public async execute(
    id: string,
    request: IAssignManagerToDepartmentRequest,
  ): Promise<void> {
    const department = await this.departmentsRepository.findById(id);

    if (!department) {
      throw new DepartmentNotFoundException(id);
    }

    const employee = await this.employeeReaderPort.findById(request.employeeId);

    if (!employee) {
      throw new EmployeeNotFoundException(request.employeeId);
    }

    if (department.getId() !== employee.departmentId) {
      throw new EmployeeNotInDepartmentException(
        employee.id,
        department.getId(),
      );
    }

    department.assignManager({
      employeeId: employee.id,
      position: employee.position,
      status: employee.status,
    });

    await this.departmentsRepository.assignManager(department);
  }
}

export const assignManagerToDepartmentUseCaseFactory = (
  departmentsRepository: IDepartmentsRepository,
  employeeReaderPort: IEmployeeReaderPort,
) =>
  new AssignManagerToDepartmentUseCase(
    departmentsRepository,
    employeeReaderPort,
  );
