import { BaseDomainException } from './base-domain-exception';

export class RoleDeactivatedException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(id: string) {
    super(`Vai trò ${id} đã bị vô hiệu hoá`);
  }
}
