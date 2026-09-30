import { BaseDomainException } from './base-domain.exception';

export class CustomerContactRejectedException extends BaseDomainException {
  public readonly statusCode: number;

  public constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
