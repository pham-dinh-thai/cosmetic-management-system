import { generateCode, isCodeFormatValid } from '@app/codes';

export const RECEIPT_CODE_PREFIX = 'PT_';

export class ReceiptCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): ReceiptCode {
    if (sequence < 1) {
      throw new Error(`Invalid sequence: ${sequence}`);
    }

    return new ReceiptCode(generateCode(RECEIPT_CODE_PREFIX, sequence));
  }

  public static fromPersistent(value: string): ReceiptCode {
    if (!isCodeFormatValid(RECEIPT_CODE_PREFIX, value)) {
      throw new Error(`Invalid receipt code "${value}"`);
    }

    return new ReceiptCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}