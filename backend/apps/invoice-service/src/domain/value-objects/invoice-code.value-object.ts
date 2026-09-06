import { InvalidInvoiceCodeException } from '../exceptions/invalid-invoice-code.exception';
import { generateCode, isCodeFormatValid } from '@app/codes';

export const INVOICE_CODE_PREFIX = 'HD_';

export class InvoiceCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): InvoiceCode {
    if (sequence < 1) {
      throw new InvalidInvoiceCodeException(sequence.toString());
    }

    return new InvoiceCode(generateCode(INVOICE_CODE_PREFIX, sequence));
  }

  public static fromPersistent(value: string): InvoiceCode {
    if (!isCodeFormatValid(INVOICE_CODE_PREFIX, value)) {
      throw new InvalidInvoiceCodeException(value);
    }

    return new InvoiceCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}
