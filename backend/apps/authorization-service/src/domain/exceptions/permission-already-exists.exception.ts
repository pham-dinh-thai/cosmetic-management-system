import { BaseDomainException } from './base-domain-exception';

export class PermissionAlreadyExistsException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(permissionId: string) {
    super(`Quyền ${permissionId} đã tồn tại`);
  }
}
