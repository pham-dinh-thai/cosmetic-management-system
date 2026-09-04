import { BaseDomainException } from './base-domain-exception';

export class CategoryNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(id: string) {
    super(`Category with id ${id} not found`);
  }
}
