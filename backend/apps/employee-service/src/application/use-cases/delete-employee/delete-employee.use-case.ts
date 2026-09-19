import { EmployeeNotFoundException } from 'apps/employee-service/src/domain/exceptions/employee-not-found.exception';
import { IEmployeesRepository } from 'apps/employee-service/src/domain/repositories/employees.repository';
import { IDeleteUserPort } from './ports/delete-user.port';
import { IEmployeeLoggerPort } from '../../ports/employee-logger.port';
import { IDepartmentManagerPort } from 'apps/employee-service/src/application/ports/department-manager.port';

export class DeleteEmployeeUseCase {
  public constructor(
    private readonly employeesRepository: IEmployeesRepository,
    private readonly deleteUserPort: IDeleteUserPort,
    private readonly logger: IEmployeeLoggerPort,
    private readonly departmentManagerPort: IDepartmentManagerPort,
  ) {}

  public async execute(id: string): Promise<void> {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new EmployeeNotFoundException(id);
    }

    // Xóa vai trò trưởng phòng trước khi xóa nhân viên, để nếu thất bại
    // thì chưa mutation gì và có thể thử lại sạch sẽ.
    await this.departmentManagerPort.unassignManager(employee.getId());

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
  departmentManagerPort: IDepartmentManagerPort,
): DeleteEmployeeUseCase =>
  new DeleteEmployeeUseCase(
    employeesRepository,
    deleteUserPort,
    logger,
    departmentManagerPort,
  );