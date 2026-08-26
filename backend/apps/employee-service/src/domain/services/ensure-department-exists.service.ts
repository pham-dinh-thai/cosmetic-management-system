import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IReadDepartmentPort,
  READ_DEPARTMENT_PORT,
} from '../../application/ports/read-department.port';

@Injectable()
export class EnsureDepartmentExistsService {
  public constructor(
    @Inject(READ_DEPARTMENT_PORT)
    private readonly readDepartmentPort: IReadDepartmentPort,
  ) {}

  public async byId(id: string): Promise<void> {
    const department = await this.readDepartmentPort.findById(id);

    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
  }
}
