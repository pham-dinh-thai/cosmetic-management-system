import { BaseDomainException } from './base-domain-exception';

export class SupplierNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(id: string) {
    super(`Supplier with id ${id} not found`);
  }
}