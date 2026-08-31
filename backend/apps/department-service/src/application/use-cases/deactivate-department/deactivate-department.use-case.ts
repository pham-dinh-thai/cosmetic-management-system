import { DepartmentNotFoundException } from 'apps/department-service/src/domain/exceptions/department-not-found.exception';
import { IDepartmentsRepository } from 'apps/department-service/src/domain/repositories/departments.repository';

export class DeactivateDepartmentUseCase {
  public constructor(
    private readonly departmentsRepository: IDepartmentsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const department = await this.departmentsRepository.findById(id);

    if (!department) {
      throw new DepartmentNotFoundException(id);
    }

    await this.departmentsRepository.deactivate(id);
  }
}

export const deactivateDepartmentUseCaseFactory = (
  departmentsRepository: IDepartmentsRepository,
) => new DeactivateDepartmentUseCase(departmentsRepository);
