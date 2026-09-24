import { BaseDomainException } from './base-domain-exception';

export class PermissionDeactivatedException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(id: string) {
    super(`Quyền ${id} đã bị vô hiệu hoá`);
  }
}
