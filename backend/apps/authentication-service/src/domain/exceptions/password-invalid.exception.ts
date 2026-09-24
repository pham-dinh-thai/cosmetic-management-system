import { BaseDomainException } from './base-domain.exception';

export class PasswordInvalidException extends BaseDomainException {
  public readonly statusCode = 401;

  public constructor(message: string) {
    super(message);
  }
}
