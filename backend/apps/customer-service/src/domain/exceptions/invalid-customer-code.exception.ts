import { BaseDomainException } from './base-domain-exception';

export class InvalidCustomerCodeException extends BaseDomainException {
  public readonly statusCode = 400;

  public constructor(code: string) {
    super(`Invalid customer code: ${code}`);
  }
}
