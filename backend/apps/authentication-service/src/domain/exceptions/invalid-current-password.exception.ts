import { BaseDomainException } from './base-domain.exception';

export class InvalidCurrentPasswordException extends BaseDomainException {
  public readonly statusCode = 401;

  public constructor() {
    super('Mật khẩu hiện tại không đúng');
  }
}