import { Inject, Injectable } from '@nestjs/common';
import { DepartmentReadModel } from 'apps/department-service/src/domain/read-models/department.read-model';
import {
  DEPARTMENTS_REPOSITORY,
  type IDepartmentsRepository,
} from 'apps/department-service/src/domain/repositories/departments.repository';

@Injectable()
export class FindDepartmentByIdUseCase {
  public constructor(
    @Inject(DEPARTMENTS_REPOSITORY)
    private readonly departmentsRepository: IDepartmentsRepository,
  ) {}

  public async execute(id: string): Promise<DepartmentReadModel | null> {
    return await this.departmentsRepository.findById(id);
  }
}
