import { BaseDomainException } from './base-domain.exception';

export class InvalidCredentialsException extends BaseDomainException {
  public readonly statusCode = 401;

  public constructor() {
    super('Email hoặc mật khẩu không hợp lệ');
  }
}
