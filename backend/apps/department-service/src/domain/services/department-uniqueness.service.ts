import { ConflictException, Inject, Injectable } from '@nestjs/common';
import {
  DEPARTMENTS_REPOSITORY,
  type IDepartmentsRepository,
} from '../repositories/departments.repository';

@Injectable()
export class DepartmentUniquenessService {
  public constructor(
    @Inject(DEPARTMENTS_REPOSITORY)
    private readonly departmentsRepository: IDepartmentsRepository,
  ) {}

  public async ensureCodeIsUnique(code: string): Promise<void> {
    const department = await this.departmentsRepository.findByCode(code);

    if (department) {
      throw new ConflictException(`Code already in use: ${code}`);
    }
  }
}
