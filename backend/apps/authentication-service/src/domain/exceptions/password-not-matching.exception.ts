import { BaseDomainException } from './base-domain.exception';

export class PasswordNotMatchingException extends BaseDomainException {
  public readonly statusCode = 401;

  public constructor() {
    super('Mật khẩu xác nhận không khớp');
  }
}
