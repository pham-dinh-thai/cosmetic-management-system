import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IUpdateDepartmentRequest } from './update-department.request';
import {
  DEPARTMENTS_REPOSITORY,
  type IDepartmentsRepository,
} from 'apps/department-service/src/domain/repositories/departments.repository';
import { DepartmentUniquenessService } from 'apps/department-service/src/domain/services/department-uniqueness.service';
import { Department } from 'apps/department-service/src/domain/department.aggregate';
import { DepartmentCodeAlreadyExistsException } from 'apps/department-service/src/domain/exceptions/department-code-already-exists.exception';

@Injectable()
export class UpdateDepartmentUseCase {
  public constructor(
    @Inject(DEPARTMENTS_REPOSITORY)
    private readonly departmentsRepository: IDepartmentsRepository,

    private readonly departmentUniquenessService: DepartmentUniquenessService,
  ) {}

  public async execute(
    id: string,
    request: IUpdateDepartmentRequest,
  ): Promise<void> {
    try {
      const existing = await this.departmentsRepository.findById(id);

      if (!existing) {
        throw new NotFoundException(`Department with id ${id} not found`);
      }

      // ensureCodeIsUnique threw ConflictException if the code is duplicate
      // Only check when the code changes
      if (existing.code !== request.code) {
        await this.departmentUniquenessService.ensureCodeIsUnique(request.code);
      }

      const department = Department.fromPersistent({
        id: existing.id,
        code: existing.code,
        name: existing.name,
      });

      department.update({ code: request.code, name: request.name });

      await this.departmentsRepository.update(id, department);
    } catch (e) {
      if (e instanceof DepartmentCodeAlreadyExistsException) {
        throw new ConflictException(e.message);
      }

      throw e;
    }
  }
}
