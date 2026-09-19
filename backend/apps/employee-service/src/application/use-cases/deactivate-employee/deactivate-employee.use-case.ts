import { EmployeeNotFoundException } from 'apps/employee-service/src/domain/exceptions/employee-not-found.exception';
import { IEmployeesRepository } from 'apps/employee-service/src/domain/repositories/employees.repository';
import { IDepartmentManagerPort } from 'apps/employee-service/src/application/ports/department-manager.port';

export class DeactivateEmployeeUseCase {
  public constructor(
    private readonly employeesRepository: IEmployeesRepository,
    private readonly departmentManagerPort: IDepartmentManagerPort,
  ) {}

  public async execute(id: string): Promise<void> {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new EmployeeNotFoundException(id);
    }

    await this.employeesRepository.deactivate(id);

    // Nhân viên bị vô hiệu hóa không được tiếp tục làm trưởng phòng.
    await this.departmentManagerPort.unassignManager(employee.getId());
  }
}

export const deactivateEmployeeUseCaseFactory = (
  employeesRepository: IEmployeesRepository,
  departmentManagerPort: IDepartmentManagerPort,
): DeactivateEmployeeUseCase =>
  new DeactivateEmployeeUseCase(employeesRepository, departmentManagerPort);