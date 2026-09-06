import { InvalidCosmeticCodeException } from '../exceptions/invalid-cosmetic-code.exception';
import { generateCode, isCodeFormatValid } from '@app/codes';

export const COSMETIC_CODE_PREFIX = 'SP_';

export class CosmeticCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): CosmeticCode {
    if (sequence < 1) {
      throw new InvalidCosmeticCodeException(sequence.toString());
    }

    return new CosmeticCode(generateCode(COSMETIC_CODE_PREFIX, sequence));
  }

  public static fromPersistent(value: string): CosmeticCode {
    if (!isCodeFormatValid(COSMETIC_CODE_PREFIX, value)) {
      throw new InvalidCosmeticCodeException(value);
    }

    return new CosmeticCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}
