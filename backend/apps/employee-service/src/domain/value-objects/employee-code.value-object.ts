import { InvalidEmployeeCodeException } from '../exceptions/invalid-employee-code.exception';

const EMPLOYEE_CODE_PREFIX = 'NV_';
const MIN_CODE_DIGITS = 5;

const EMPLOYEE_CODE_REGEX = /^NV_\d{5,}$/;

export class EmployeeCode {
  private constructor(private readonly value: string) {}

  public static generate(sequence: number): EmployeeCode {
    if (sequence < 1) {
      throw new InvalidEmployeeCodeException(sequence.toString());
    }

    return new EmployeeCode(
      `${EMPLOYEE_CODE_PREFIX}${sequence
        .toString()
        .padStart(MIN_CODE_DIGITS, '0')}`,
    );
  }

  public static fromPersistent(value: string): EmployeeCode {
    if (!EMPLOYEE_CODE_REGEX.test(value)) {
      throw new InvalidEmployeeCodeException(value);
    }

    return new EmployeeCode(value);
  }

  public getValue(): string {
    return this.value;
  }
}
