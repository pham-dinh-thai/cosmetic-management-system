import { BaseDomainException } from './base-domain-exception';

export class DuplicateCategoryNameException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(name: string) {
    super(`Category with name "${name}" already exists`);
  }
}
