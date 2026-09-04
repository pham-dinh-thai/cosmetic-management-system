import { InvalidCosmeticCodeException } from '../exceptions/invalid-cosmetic-code.exception';

const COSMETIC_CODE_PREFIX = 'SP_';
const MIN_CODE_DIGITS = 5;

const COSMETIC_CODE_REGEX = /^SP_\d{5,}$/;

export class CosmeticCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): CosmeticCode {
    if (sequence < 1) {
      throw new InvalidCosmeticCodeException(sequence.toString());
    }

    return new CosmeticCode(
      `${COSMETIC_CODE_PREFIX}${sequence
        .toString()
        .padStart(MIN_CODE_DIGITS, '0')}`,
    );
  }

  public static fromPersistent(value: string): CosmeticCode {
    if (!COSMETIC_CODE_REGEX.test(value)) {
      throw new InvalidCosmeticCodeException(value);
    }

    return new CosmeticCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}
