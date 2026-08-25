import { Inject, Injectable } from '@nestjs/common';
import { DepartmentReadModel } from 'apps/department-service/src/domain/read-models/department.read-model';
import {
  DEPARTMENTS_REPOSITORY,
  type IDepartmentsRepository,
} from 'apps/department-service/src/domain/repositories/departments.repository';

@Injectable()
export class FindDepartmentsUseCase {
  public constructor(
    @Inject(DEPARTMENTS_REPOSITORY)
    private readonly departmentsRepository: IDepartmentsRepository,
  ) {}

  public async execute(): Promise<DepartmentReadModel[]> {
    return await this.departmentsRepository.findAll();
  }
}
