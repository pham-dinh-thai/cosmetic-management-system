import { BaseDomainException } from './base-domain.exception';

export class UserNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(key: string, value: string) {
    super(`Người dùng ${key}: ${value} - không tìm thấy`);
  }
}
