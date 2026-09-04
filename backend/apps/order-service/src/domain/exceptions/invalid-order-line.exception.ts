import { BaseDomainException } from './base-domain-exception';

export class InvalidOrderLineException extends BaseDomainException {
  public readonly statusCode = 400;
  public readonly code = 'INVALID_ORDER_LINE';

  public constructor(message: string) {
    super(message);
  }
}
