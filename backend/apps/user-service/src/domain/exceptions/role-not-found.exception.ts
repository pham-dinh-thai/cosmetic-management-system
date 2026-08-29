import { BaseDomainException } from './base-domain.exception';

export class RoleNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(id: string) {
    super(`Role with id ${id} not found`);
  }
}
