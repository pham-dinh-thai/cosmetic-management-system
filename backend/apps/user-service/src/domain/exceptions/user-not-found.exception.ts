import { BaseDomainException } from './base-domain.exception';

export class UserNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(id: string) {
    super(`User with id ${id} not found`);
  }
}
