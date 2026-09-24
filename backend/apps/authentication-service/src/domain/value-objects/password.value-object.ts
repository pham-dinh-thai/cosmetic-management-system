import bcrypt from 'bcrypt';
import { PasswordInvalidException } from '../exceptions/password-invalid.exception';

const DEFAULT_SALT_OR_ROUNDS: string | number = 10;
const MIN_LENGTH = 8;
const MAX_LENGTH = 255;
const HAS_NUMBER_AND_LETTER =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+-=]{8,}$/;

export class Password {
  private constructor(private readonly value: string) {}

  public static async fromPlainText(value: string): Promise<Password> {
    if (value.length < MIN_LENGTH) {
      throw new PasswordInvalidException(
        `Mật khẩu quá ngắn (tối thiểu ${MIN_LENGTH}) ký tự`,
      );
    }

    if (value.length > MAX_LENGTH) {
      throw new PasswordInvalidException(
        `Mật khẩu dài quá ký tự cho phép (tối đa ${MAX_LENGTH}) ký tự`,
      );
    }

    if (!HAS_NUMBER_AND_LETTER.test(value)) {
      throw new PasswordInvalidException(
        'Mật khẩu phải chứa ít nhất 1 chữ và 1 số',
      );
    }

    const hashed = await bcrypt.hash(value, DEFAULT_SALT_OR_ROUNDS);

    return new Password(hashed);
  }

  public static fromHashed(value: string): Password {
    return new Password(value);
  }

  public async compare(plainText: string): Promise<boolean> {
    return await bcrypt.compare(plainText, this.value);
  }

  public getValue(): string {
    return this.value;
  }
}
