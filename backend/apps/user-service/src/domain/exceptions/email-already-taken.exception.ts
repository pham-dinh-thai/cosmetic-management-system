import { ConflictException } from '@nestjs/common';

export class EmailAlreadyTakenException extends ConflictException {
  public constructor(email: string) {
    super(`Email already in use: ${email}`);
  }
}
