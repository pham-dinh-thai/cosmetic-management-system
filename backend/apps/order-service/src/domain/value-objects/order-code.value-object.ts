import { InvalidOrderCodeException } from '../exceptions/invalid-order-code.exception';
import { generateCode, isCodeFormatValid } from '@app/codes';

export const ORDER_CODE_PREFIX = 'DH_';

export class OrderCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): OrderCode {
    if (sequence < 1) {
      throw new InvalidOrderCodeException(sequence.toString());
    }

    return new OrderCode(generateCode(ORDER_CODE_PREFIX, sequence));
  }

  public static fromPersistent(value: string): OrderCode {
    if (!isCodeFormatValid(ORDER_CODE_PREFIX, value)) {
      throw new InvalidOrderCodeException(value);
    }

    return new OrderCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}
