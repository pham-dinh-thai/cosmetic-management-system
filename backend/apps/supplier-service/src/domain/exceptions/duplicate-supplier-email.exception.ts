import { BaseDomainException } from './base-domain-exception';

export class DuplicateSupplierEmailException extends BaseDomainException {
  public readonly statusCode = 409;

  public constructor(email: string) {
    super(`Supplier with email "${email}" already exists`);
  }
}
