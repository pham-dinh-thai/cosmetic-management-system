import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  DEPARTMENTS_REPOSITORY,
  type IDepartmentsRepository,
} from 'apps/department-service/src/domain/repositories/departments.repository';

@Injectable()
export class ActivateDepartmentUseCase {
  public constructor(
    @Inject(DEPARTMENTS_REPOSITORY)
    private readonly departmentsRepository: IDepartmentsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const existing = await this.departmentsRepository.findById(id);

    if (!existing) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }

    await this.departmentsRepository.activate(id);
  }
}
