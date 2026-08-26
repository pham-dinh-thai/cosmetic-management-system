import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  type IDepartmentsReaderPort,
  DEPARTMENTS_READER_PORT,
} from '../ports/departments-reader.port';

@Injectable()
export class EnsureDepartmentExistsService {
  public constructor(
    @Inject(DEPARTMENTS_READER_PORT)
    private readonly departmentsReaderPort: IDepartmentsReaderPort,
  ) {}

  public async byId(id: string): Promise<void> {
    const department = await this.departmentsReaderPort.findById(id);

    if (!department) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
  }
}
