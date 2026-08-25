import { Injectable } from '@nestjs/common';
import { UuidService } from 'nestjs-uuid';
import { ICreateDepartmentIdPort } from '../../application/ports/create-department-id.port';

@Injectable()
export class CreateDepartmentUuidAdapter implements ICreateDepartmentIdPort {
  public constructor(private readonly uuidService: UuidService) {}

  public generate(): string {
    return this.uuidService.generate({ version: 4 });
  }
}
