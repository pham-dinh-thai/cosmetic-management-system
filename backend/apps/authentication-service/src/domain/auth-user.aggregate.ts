import { CreateAuthUserProps } from './types';

export class AuthUser {
  public constructor(
    private readonly id: string,
    private readonly userId: string,
    private password: string,
  ) {}

  public static create(props: CreateAuthUserProps): AuthUser {
    return new AuthUser(props.id, props.userId, props.password);
  }

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getPassword(): string {
    return this.password;
  }
}
