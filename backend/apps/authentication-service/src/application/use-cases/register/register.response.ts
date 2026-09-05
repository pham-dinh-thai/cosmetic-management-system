export class RegisterResponse {
  public constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
    public readonly userId: string,
  ) {}
}
