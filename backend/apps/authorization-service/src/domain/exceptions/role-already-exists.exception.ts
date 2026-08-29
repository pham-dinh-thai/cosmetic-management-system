import { BaseDomainException } from './base-domain-exception';

export class RoleAlreadyExistsException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(id: string) {
    super(`Role with id ${id} already exists`);
  }
}
