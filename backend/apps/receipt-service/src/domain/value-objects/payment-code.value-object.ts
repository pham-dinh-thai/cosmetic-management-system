import { generateCode, isCodeFormatValid } from '@app/codes';

export const PAYMENT_CODE_PREFIX = 'PC_';

export class PaymentCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): PaymentCode {
    if (sequence < 1) {
      throw new Error(`Invalid sequence: ${sequence}`);
    }

    return new PaymentCode(generateCode(PAYMENT_CODE_PREFIX, sequence));
  }

  public static fromPersistent(value: string): PaymentCode {
    if (!isCodeFormatValid(PAYMENT_CODE_PREFIX, value)) {
      throw new Error(`Invalid payment code "${value}"`);
    }

    return new PaymentCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}