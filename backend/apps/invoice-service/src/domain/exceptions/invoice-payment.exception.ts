import { BaseDomainException } from './base-domain-exception';

export class InvoicePaymentException extends BaseDomainException {
  public readonly statusCode = 400;
  public readonly code = 'INVALID_INVOICE_PAYMENT';

  public constructor(message: string) {
    super(message);
  }
}
