import { BaseDomainException } from './base-domain.exception';

export class UserNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(userId: string) {
    super(`User with id ${userId} not found`);
  }
}
