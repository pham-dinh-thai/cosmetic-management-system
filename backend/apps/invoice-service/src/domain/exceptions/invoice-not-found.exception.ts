import { BaseDomainException } from './base-domain-exception';

export class InvoiceNotFoundException extends BaseDomainException {
  public readonly statusCode = 404;
  public readonly code = 'INVOICE_NOT_FOUND';

  public constructor(id: string) {
    super(`Invoice "${id}" was not found`);
  }
}
