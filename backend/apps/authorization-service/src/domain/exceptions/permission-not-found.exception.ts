import { BaseDomainException } from './base-domain-exception';

export class PermissionNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(id: string) {
    super(`Không tìm thấy quyền ${id}`);
  }
}
