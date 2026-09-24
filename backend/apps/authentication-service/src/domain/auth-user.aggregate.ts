import { InvalidCurrentPasswordException } from './exceptions/invalid-current-password.exception';
import { PasswordNotMatchingException } from './exceptions/password-not-matching.exception';
import { CreateAuthUserProps, fromPersistentAuthUserProps } from './types';
import { Password } from './value-objects/password.value-object';

export class AuthUser {
  public constructor(
    private readonly id: string,
    private readonly userId: string,
    private password: Password,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {}

  public static async create(props: CreateAuthUserProps): Promise<AuthUser> {
    return new AuthUser(
      undefined as unknown as string,
      props.userId,
      await Password.fromPlainText(props.password),
      new Date(),
      new Date(),
    );
  }

  public static fromPersistent(props: fromPersistentAuthUserProps): AuthUser {
    return new AuthUser(
      props.id,
      props.userId,
      Password.fromHashed(props.password),
      props.createdAt,
      props.updatedAt,
    );
  }

  public async changePassword(
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string,
  ): Promise<void> {
    const isMatchedWithOldPassword =
      await this.password.compare(currentPassword);
    if (!isMatchedWithOldPassword) {
      throw new InvalidCurrentPasswordException();
    }

    if (newPassword !== newPasswordConfirmation) {
      throw new PasswordNotMatchingException();
    }

    this.password = await Password.fromPlainText(newPassword);
    this.updatedAt = new Date();
  }

  public async comparePassword(plainText: string): Promise<boolean> {
    return await this.password.compare(plainText);
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getPassword(): string {
    return this.password.getValue();
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
