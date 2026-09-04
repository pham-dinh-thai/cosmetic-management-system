import { InvalidInvoiceCodeException } from '../exceptions/invalid-invoice-code.exception';

const INVOICE_CODE_PREFIX = 'HD_';
const MIN_CODE_DIGITS = 5;

const INVOICE_CODE_REGEX = /^HD_\d{5,}$/;

export class InvoiceCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): InvoiceCode {
    if (sequence < 1) {
      throw new InvalidInvoiceCodeException(sequence.toString());
    }

    return new InvoiceCode(
      `${INVOICE_CODE_PREFIX}${sequence.toString().padStart(MIN_CODE_DIGITS, '0')}`,
    );
  }

  public static fromPersistent(value: string): InvoiceCode {
    if (!INVOICE_CODE_REGEX.test(value)) {
      throw new InvalidInvoiceCodeException(value);
    }

    return new InvoiceCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}
