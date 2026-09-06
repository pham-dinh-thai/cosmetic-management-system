import { DepartmentNotFoundException } from 'apps/department-service/src/domain/exceptions/department-not-found.exception';
import { IDepartmentsRepository } from 'apps/department-service/src/domain/repositories/departments.repository';

export class DeleteDepartmentUseCase {
  public constructor(
    private readonly departmentsRepository: IDepartmentsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const department = await this.departmentsRepository.findById(id);

    if (!department) {
      throw new DepartmentNotFoundException(id);
    }

    await this.departmentsRepository.delete(id);
  }
}

export const deleteDepartmentUseCaseFactory = (
  departmentsRepository: IDepartmentsRepository,
) => new DeleteDepartmentUseCase(departmentsRepository);