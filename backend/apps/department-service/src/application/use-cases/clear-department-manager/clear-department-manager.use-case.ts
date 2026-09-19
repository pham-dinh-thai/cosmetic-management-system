import { IDepartmentsRepository } from 'apps/department-service/src/domain/repositories/departments.repository';

export class ClearDepartmentManagerUseCase {
  public constructor(
    private readonly departmentsRepository: IDepartmentsRepository,
  ) {}

  public async execute(employeeId: string): Promise<void> {
    await this.departmentsRepository.removeManagerByEmployee(employeeId);
  }
}

export const clearDepartmentManagerUseCaseFactory = (
  departmentsRepository: IDepartmentsRepository,
): ClearDepartmentManagerUseCase =>
  new ClearDepartmentManagerUseCase(departmentsRepository);