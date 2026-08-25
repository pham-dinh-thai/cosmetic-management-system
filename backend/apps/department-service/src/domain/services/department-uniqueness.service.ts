import { type IDepartmentsRepository } from '../repositories/departments.repository';
import { DepartmentCodeAlreadyExistsException } from '../exceptions/department-code-already-exists.exception';

export class DepartmentUniquenessService {
  public constructor(
    private readonly departmentsRepository: IDepartmentsRepository,
  ) {}

  public async ensureCodeIsUnique(code: string): Promise<void> {
    const department = await this.departmentsRepository.findByCode(code);

    if (department) {
      throw new DepartmentCodeAlreadyExistsException(code);
    }
  }
}
