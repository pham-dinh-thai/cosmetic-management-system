import { BaseDomainException } from './base-domain-exception';

export class PhoneNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(id: string) {
    super(`Phone ${id} not found`);
  }
}
