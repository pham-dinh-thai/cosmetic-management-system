import { Injectable } from '@nestjs/common';
import { UuidService } from 'nestjs-uuid';
import { ICreateAuthUserIdPort } from '../../application/ports/create-auth-user-id.port';

@Injectable()
export class CreateAuthUserUuidAdapter implements ICreateAuthUserIdPort {
  public constructor(private readonly uuidService: UuidService) {}

  public generate(): string {
    return this.uuidService.generate({ version: 4 });
  }
}
