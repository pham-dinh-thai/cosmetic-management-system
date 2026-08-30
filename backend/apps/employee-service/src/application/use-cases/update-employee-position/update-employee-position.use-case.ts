import { IEmployeesRepository } from 'apps/employee-service/src/domain/repositories/employees.repository';
import { IUpdateEmployeePositionRequest } from './update-employee-position.request';
import { EmployeeNotFoundException } from 'apps/employee-service/src/domain/exceptions/employee-not-found.exception';

export class UpdateEmployeePositionUseCase {
  public constructor(
    private readonly employeesRepository: IEmployeesRepository,
  ) {}

  public async execute(
    id: string,
    request: IUpdateEmployeePositionRequest,
  ): Promise<void> {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new EmployeeNotFoundException(id);
    }

    employee.updatePosition(request.position);

    await this.employeesRepository.updatePosition(employee);
  }
}

export const updateEmployeePositionUseCaseFactory = (
  employeesRepository: IEmployeesRepository,
) => new UpdateEmployeePositionUseCase(employeesRepository);
