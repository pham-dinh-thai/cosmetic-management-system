import { InvalidEmployeeCodeException } from '../exceptions/invalid-employee-code.exception';
import { generateCode, isCodeFormatValid } from '@app/codes';

export const EMPLOYEE_CODE_PREFIX = 'NV_';

export class EmployeeCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): EmployeeCode {
    if (sequence < 1) {
      throw new InvalidEmployeeCodeException(sequence.toString());
    }

    return new EmployeeCode(generateCode(EMPLOYEE_CODE_PREFIX, sequence));
  }

  public static fromPersistent(value: string): EmployeeCode {
    if (!isCodeFormatValid(EMPLOYEE_CODE_PREFIX, value)) {
      throw new InvalidEmployeeCodeException(value);
    }

    return new EmployeeCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}
