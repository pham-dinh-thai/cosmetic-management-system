import { EmployeeNotFoundException } from 'apps/employee-service/src/domain/exceptions/employee-not-found.exception';
import { IEmployeesRepository } from 'apps/employee-service/src/domain/repositories/employees.repository';

export class ActivateEmployeeUseCase {
  public constructor(
    private readonly employeesRepository: IEmployeesRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new EmployeeNotFoundException(id);
    }

    await this.employeesRepository.activate(id);
  }
}

export const activateEmployeeUseCaseFactory = (
  employeesRepository: IEmployeesRepository,
): ActivateEmployeeUseCase => new ActivateEmployeeUseCase(employeesRepository);