import { InvalidOrderCodeException } from '../exceptions/invalid-order-code.exception';

const ORDER_CODE_PREFIX = 'DH_';
const MIN_CODE_DIGITS = 5;

const ORDER_CODE_REGEX = /^DH_\d{5,}$/;

export class OrderCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): OrderCode {
    if (sequence < 1) {
      throw new InvalidOrderCodeException(sequence.toString());
    }

    return new OrderCode(
      `${ORDER_CODE_PREFIX}${sequence.toString().padStart(MIN_CODE_DIGITS, '0')}`,
    );
  }

  public static fromPersistent(value: string): OrderCode {
    if (!ORDER_CODE_REGEX.test(value)) {
      throw new InvalidOrderCodeException(value);
    }

    return new OrderCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}
