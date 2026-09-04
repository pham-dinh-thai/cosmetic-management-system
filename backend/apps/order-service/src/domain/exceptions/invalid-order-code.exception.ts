import { BaseDomainException } from './base-domain-exception';

export class InvalidOrderCodeException extends BaseDomainException {
  public readonly statusCode = 400;
  public readonly code = 'INVALID_ORDER_CODE';

  public constructor(value: string) {
    super(`Order code "${value}" is invalid`);
  }
}
