import { InvalidSupplierCodeException } from '../exceptions/invalid-supplier-code.exception';
import { generateCode, isCodeFormatValid } from '@app/codes';

export const SUPPLIER_CODE_PREFIX = 'NCC_';

export class SupplierCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): SupplierCode {
    if (sequence < 1) {
      throw new InvalidSupplierCodeException(sequence.toString());
    }

    return new SupplierCode(generateCode(SUPPLIER_CODE_PREFIX, sequence));
  }

  public static fromPersistent(value: string): SupplierCode {
    if (!isCodeFormatValid(SUPPLIER_CODE_PREFIX, value)) {
      throw new InvalidSupplierCodeException(value);
    }

    return new SupplierCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}
