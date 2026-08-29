import { BaseDomainException } from './base-domain.exception';

export class AuthUserAlreadyExistsException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(userId: string) {
    super(`Auth user for userId ${userId} already exists`);
  }
}
