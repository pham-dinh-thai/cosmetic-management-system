import { InvalidSupplierCodeException } from '../exceptions/invalid-supplier-code.exception';

const SUPPLIER_CODE_PREFIX = 'NCC_';
const MIN_CODE_DIGITS = 5;

const SUPPLIER_CODE_REGEX = /^NCC_\d{5,}$/;

export class SupplierCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): SupplierCode {
    if (sequence < 1) {
      throw new InvalidSupplierCodeException(sequence.toString());
    }

    return new SupplierCode(
      `${SUPPLIER_CODE_PREFIX}${sequence
        .toString()
        .padStart(MIN_CODE_DIGITS, '0')}`,
    );
  }

  public static fromPersistent(value: string): SupplierCode {
    if (!SUPPLIER_CODE_REGEX.test(value)) {
      throw new InvalidSupplierCodeException(value);
    }

    return new SupplierCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}