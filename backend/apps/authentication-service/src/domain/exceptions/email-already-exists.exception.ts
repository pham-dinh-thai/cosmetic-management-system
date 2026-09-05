import { BaseDomainException } from './base-domain.exception';

export class EmailAlreadyExistsException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(email: string) {
    super(`Email ${email} already exists`);
  }
}
