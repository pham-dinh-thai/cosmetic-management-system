import { IEmployeesRepository } from 'apps/employee-service/src/domain/repositories/employees.repository';
import { FindEmployeeByIdReadModel } from './read-models/find-employee-by-id.read-model';

export class FindEmployeeByIdUseCase {
  public constructor(
    private readonly employeesRepository: IEmployeesRepository,
  ) {}

  public async execute(id: string): Promise<FindEmployeeByIdReadModel | null> {
    const employee = await this.employeesRepository.findById(id);

    return employee
      ? new FindEmployeeByIdReadModel(
          employee.getId(),
          employee.getUserId(),
          employee.getCode(),
          employee.getDepartmentId(),
          employee.getHiredAt(),
          employee.getStatus(),
          employee.getPosition(),
          employee.getPhone(),
          employee.getAddress(),
        )
      : null;
  }
}

export const findEmployeeByIdUseCaseFactory = (
  employeesRepository: IEmployeesRepository,
) => new FindEmployeeByIdUseCase(employeesRepository);
