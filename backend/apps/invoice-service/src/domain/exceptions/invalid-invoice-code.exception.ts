import { BaseDomainException } from './base-domain-exception';

export class InvalidInvoiceCodeException extends BaseDomainException {
  public readonly statusCode = 400;
  public readonly code = 'INVALID_INVOICE_CODE';

  public constructor(value: string) {
    super(`Invoice code "${value}" is invalid`);
  }
}
