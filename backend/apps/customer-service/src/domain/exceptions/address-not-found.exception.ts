import { BaseDomainException } from './base-domain-exception';

export class AddressNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(id: string) {
    super(`Address ${id} not found`);
  }
}
