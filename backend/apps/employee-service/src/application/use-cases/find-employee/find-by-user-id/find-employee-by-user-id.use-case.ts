import { IEmployeesRepository } from 'apps/employee-service/src/domain/repositories/employees.repository';
import { FindEmployeeByUserIdReadModel } from './find-employee-by-user-id.read-model';

export class FindEmployeeByUserIdUseCase {
  public constructor(
    private readonly employeesRepository: IEmployeesRepository,
  ) {}

  public async execute(
    userId: string,
  ): Promise<FindEmployeeByUserIdReadModel | null> {
    const employee = await this.employeesRepository.findByUserId(userId);

    if (!employee) {
      return null;
    }

    return new FindEmployeeByUserIdReadModel(
      employee.getId(),
      employee.getCode(),
      employee.getDepartmentId(),
      employee.getPosition(),
      employee.getStatus(),
    );
  }
}

export const findEmployeeByUserIdUseCaseFactory = (
  employeesRepository: IEmployeesRepository,
): FindEmployeeByUserIdUseCase =>
  new FindEmployeeByUserIdUseCase(employeesRepository);
