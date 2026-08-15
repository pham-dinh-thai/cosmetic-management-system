import { Injectable } from '@nestjs/common';
import { CreateUserIdPort } from '../../application/ports/create-user-id.port';
import { UuidService } from 'nestjs-uuid';

@Injectable()
export class CreateUserUuidAdapter implements CreateUserIdPort {
  public constructor(private readonly uuidService: UuidService) {}

  public generate(): string {
    return this.uuidService.generate({ version: 4 });
  }
}
