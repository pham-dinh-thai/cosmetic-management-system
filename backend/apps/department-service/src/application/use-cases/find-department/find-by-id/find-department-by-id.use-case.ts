import { IDepartmentsRepository } from 'apps/department-service/src/domain/repositories/departments.repository';
import { FindDepartmentByIdReadModel } from './read-models/find-department-by-id.read-model';

export class FindDepartmentByIdUseCase {
  public constructor(
    private readonly departmentsRepository: IDepartmentsRepository,
  ) {}

  public async execute(
    id: string,
  ): Promise<FindDepartmentByIdReadModel | null> {
    const department = await this.departmentsRepository.findById(id);

    return department
      ? new FindDepartmentByIdReadModel(
          department.getId(),
          department.getCode(),
          department.getName(),
          department.getIsActive(),
          department.getManagerId(),
        )
      : null;
  }
}

export const findDepartmentByIdUseCaseFactory = (
  departmentsRepository: IDepartmentsRepository,
) => new FindDepartmentByIdUseCase(departmentsRepository);
