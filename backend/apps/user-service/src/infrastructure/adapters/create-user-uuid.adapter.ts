import { Injectable } from '@nestjs/common';
import { ICreateUserIdPort } from '../../application/ports/create-user-id.port';
import { UuidService } from 'nestjs-uuid';

@Injectable()
export class CreateUserUuidAdapter implements ICreateUserIdPort {
  public constructor(private readonly uuidService: UuidService) {}

  public generate(): string {
    return this.uuidService.generate({ version: 4 });
  }
}
