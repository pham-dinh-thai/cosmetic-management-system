import { BaseDomainException } from './base-domain.exception';

export class InvalidRefreshTokenException extends BaseDomainException {
  public readonly statusCode = 401;

  public constructor() {
    super('Refresh token không hợp lệ hoặc đã hết hạn');
  }
}
