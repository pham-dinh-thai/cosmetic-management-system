export class LoginResponse {
  public constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) {}
}
