import { EmployeeNotFoundException } from 'apps/employee-service/src/domain/exceptions/employee-not-found.exception';
import { IEmployeesRepository } from 'apps/employee-service/src/domain/repositories/employees.repository';
import { IDeleteUserPort } from './ports/delete-user.port';
import { IEmployeeLoggerPort } from '../../ports/employee-logger.port';

export class DeleteEmployeeUseCase {
  public constructor(
    private readonly employeesRepository: IEmployeesRepository,
    private readonly deleteUserPort: IDeleteUserPort,
    private readonly logger: IEmployeeLoggerPort,
  ) {}

  public async execute(id: string): Promise<void> {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new EmployeeNotFoundException(id);
    }

    const deletedEmployee = await this.employeesRepository.delete(
      employee.getId(),
    );

    if (!deletedEmployee) {
      this.logger.warn(`Employee ${id} not deleted, aborting saga`);
      return;
    }

    const isUserDeleted = await this.deleteUserPort.execute(
      employee.getUserId(),
    );

    if (isUserDeleted) {
      return;
    }

    this.logger.warn(
      `Failed to delete user ${employee.getUserId()}, rolling back employee ${id}`,
    );

    await this.employeesRepository.create(deletedEmployee);
  }
}

export const deleteEmployeeUseCaseFactory = (
  employeesRepository: IEmployeesRepository,
  deleteUserPort: IDeleteUserPort,
  logger: IEmployeeLoggerPort,
): DeleteEmployeeUseCase =>
  new DeleteEmployeeUseCase(employeesRepository, deleteUserPort, logger);