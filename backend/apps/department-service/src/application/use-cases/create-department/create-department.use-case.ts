import { Inject, Injectable } from '@nestjs/common';
import {
  DEPARTMENTS_REPOSITORY,
  type IDepartmentsRepository,
} from 'apps/department-service/src/domain/repositories/departments.repository';
import { ICreateDepartmentRequest } from './create-department.request';
import { Department } from 'apps/department-service/src/domain/department.aggregate';
import { DepartmentUniquenessService } from 'apps/department-service/src/domain/services/department-uniqueness.service';

@Injectable()
export class CreateDepartmentUseCase {
  public constructor(
    @Inject(DEPARTMENTS_REPOSITORY)
    private readonly departmentsRepository: IDepartmentsRepository,

    private readonly departmentUniquenessService: DepartmentUniquenessService,
  ) {}

  public async execute(request: ICreateDepartmentRequest): Promise<void> {
    await this.departmentUniquenessService.ensureCodeIsUnique(request.code);

    const department = Department.create({
      code: request.code,
      name: request.name,
    });

    await this.departmentsRepository.create(department);
  }
}
