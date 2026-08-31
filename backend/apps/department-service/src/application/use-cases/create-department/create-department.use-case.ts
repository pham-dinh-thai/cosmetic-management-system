import { IDepartmentsRepository } from 'apps/department-service/src/domain/repositories/departments.repository';
import { ICreateDepartmentRequest } from './create-department.request';
import { Department } from 'apps/department-service/src/domain/department.aggregate';
import { DepartmentCodeAlreadyExistsException } from 'apps/department-service/src/domain/exceptions/department-code-already-exists.exception';

export class CreateDepartmentUseCase {
  public constructor(
    private readonly departmentsRepository: IDepartmentsRepository,
  ) {}

  public async execute(request: ICreateDepartmentRequest): Promise<void> {
    const existing = await this.departmentsRepository.findByCode(request.code);

    if (existing) {
      throw new DepartmentCodeAlreadyExistsException(request.code);
    }

    const department = Department.create({
      code: request.code,
      name: request.name,
    });

    await this.departmentsRepository.create(department);
  }
}

export const createDepartmentUseCaseFactory = (
  departmentsRepository: IDepartmentsRepository,
) => new CreateDepartmentUseCase(departmentsRepository);
