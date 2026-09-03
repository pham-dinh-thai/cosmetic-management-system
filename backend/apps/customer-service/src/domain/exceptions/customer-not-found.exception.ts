import { BaseDomainException } from './base-domain-exception';

export class CustomerNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;

  public constructor(id: string) {
    super(`Customer with id ${id} not found`);
  }
}
