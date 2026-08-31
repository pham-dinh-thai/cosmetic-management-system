import { IUpdateDepartmentRequest } from './update-department.request';
import { IDepartmentsRepository } from 'apps/department-service/src/domain/repositories/departments.repository';
import { DepartmentNotFoundException } from 'apps/department-service/src/domain/exceptions/department-not-found.exception';
import { DepartmentCodeAlreadyExistsException } from 'apps/department-service/src/domain/exceptions/department-code-already-exists.exception';

export class UpdateDepartmentUseCase {
  public constructor(
    private readonly departmentsRepository: IDepartmentsRepository,
  ) {}

  public async execute(
    id: string,
    request: IUpdateDepartmentRequest,
  ): Promise<void> {
    const department = await this.departmentsRepository.findById(id);

    if (!department) {
      throw new DepartmentNotFoundException(id);
    }

    // threw DepartmentCodeAlreadyExistsException if the 'code' is duplicate
    // Only check when the 'code' changes
    if (department.getCode() !== request.code) {
      const isExists = await this.departmentsRepository.findByCode(
        request.code,
      );

      if (isExists) {
        throw new DepartmentCodeAlreadyExistsException(request.code);
      }
    }

    department.updateCode(request.code);
    department.updateName(request.name);

    await this.departmentsRepository.update(id, department);
  }
}
