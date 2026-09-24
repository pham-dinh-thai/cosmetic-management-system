import { BaseDomainException } from './base-domain.exception';

export class AuthUserNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(userId: string) {
    super(`Tài khoản ${userId} không tồn tại`);
  }
}
