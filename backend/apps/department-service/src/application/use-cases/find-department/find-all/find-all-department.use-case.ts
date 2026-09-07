import { IDepartmentsRepository } from 'apps/department-service/src/domain/repositories/departments.repository';
import { FindAllDepartmentReadModel } from './read-models/find-all-department.read-model';

export class FindAllDepartmentUseCase {
  public constructor(
    private readonly departmentsRepository: IDepartmentsRepository,
  ) {}

  public async execute(): Promise<FindAllDepartmentReadModel[]> {
    const departments = await this.departmentsRepository.findAll();

    return departments.map(
      (department) =>
        new FindAllDepartmentReadModel(
          department.getId(),
          department.getCode(),
          department.getName(),
          department.getIsActive(),
          department.getManagerId(),
        ),
    );
  }
}

export const findAllDepartmentUseCaseFactory = (
  departmentsRepository: IDepartmentsRepository,
) => new FindAllDepartmentUseCase(departmentsRepository);
