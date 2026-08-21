export class AuthUserReadModel {
  public constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly password: string,
  ) {}
}
