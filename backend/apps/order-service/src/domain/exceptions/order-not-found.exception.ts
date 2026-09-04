import { BaseDomainException } from './base-domain-exception';

export class OrderNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;
  public readonly code = 'ORDER_NOT_FOUND';

  public constructor(id: string) {
    super(`Order "${id}" was not found`);
  }
}
