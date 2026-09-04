import { BaseDomainException } from './base-domain-exception';

export class InvalidSupplierCodeException extends BaseDomainException {
  public readonly statusCode = 400;

  public constructor(code: string) {
    super(`Invalid supplier code: ${code}`);
  }
}
