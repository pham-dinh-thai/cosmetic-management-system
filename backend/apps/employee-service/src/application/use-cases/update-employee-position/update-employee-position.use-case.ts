import { IEmployeesRepository } from 'apps/employee-service/src/domain/repositories/employees.repository';
import { IUpdateEmployeePositionRequest } from './update-employee-position.request';
import { EmployeeNotFoundException } from 'apps/employee-service/src/domain/exceptions/employee-not-found.exception';
import { DepartmentAlreadyHasManagerException } from 'apps/employee-service/src/domain/exceptions/department-already-has-manager.exception';
import { IDepartmentsReaderPort } from 'apps/employee-service/src/application/ports/departments-reader.port';
import { IDepartmentManagerPort } from 'apps/employee-service/src/application/ports/department-manager.port';

export class UpdateEmployeePositionUseCase {
  public constructor(
    private readonly employeesRepository: IEmployeesRepository,
    private readonly departmentsReaderPort: IDepartmentsReaderPort,
    private readonly departmentManagerPort: IDepartmentManagerPort,
  ) {}

  public async execute(
    id: string,
    request: IUpdateEmployeePositionRequest,
  ): Promise<void> {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new EmployeeNotFoundException(id);
    }

    if (request.position === 'manager') {
      const department = employee.getDepartmentId()
        ? await this.departmentsReaderPort.findById(employee.getDepartmentId())
        : null;

      if (department?.managerId && department.managerId !== employee.getId()) {
        throw new DepartmentAlreadyHasManagerException(
          employee.getDepartmentId(),
        );
      }
    }

    employee.updatePosition(request.position);

    await this.employeesRepository.updatePosition(employee);

    // Nhân viên không còn là manager (hoặc bị giáng chức) thì không được
    // giữ vai trò trưởng phòng.
    if (request.position !== 'manager') {
      await this.departmentManagerPort.unassignManager(employee.getId());
    }
  }
}

export const updateEmployeePositionUseCaseFactory = (
  employeesRepository: IEmployeesRepository,
  departmentsReaderPort: IDepartmentsReaderPort,
  departmentManagerPort: IDepartmentManagerPort,
) =>
  new UpdateEmployeePositionUseCase(
    employeesRepository,
    departmentsReaderPort,
    departmentManagerPort,
  );