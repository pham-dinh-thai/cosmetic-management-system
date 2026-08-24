import { Inject, Injectable } from '@nestjs/common';
import {
  DEPARTMENTS_REPOSITORY,
  type IDepartmentsRepository,
} from 'apps/department-service/src/domain/repositories/departments.repository';
import { ICreateDepartmentRequest } from './create-department.request';
import {
  CREATE_DEPARTMENT_ID_PORT,
  type ICreateDepartmentIdPort,
} from '../../ports/create-department-id.port';
import { Department } from 'apps/department-service/src/domain/department.aggregate';

@Injectable()
export class CreateDepartmentUseCase {
  public constructor(
    @Inject(DEPARTMENTS_REPOSITORY)
    private readonly departmentsRepository: IDepartmentsRepository,

    @Inject(CREATE_DEPARTMENT_ID_PORT)
    private readonly createDepartmentIdPort: ICreateDepartmentIdPort,
  ) {}

  public async execute(request: ICreateDepartmentRequest): Promise<void> {
    const id = this.createDepartmentIdPort.generate();

    const department = Department.create({
      id,
      code: request.code,
      name: request.name,
      managerId: request.managerId,
    });

    await this.departmentsRepository.create(department);
  }
}
