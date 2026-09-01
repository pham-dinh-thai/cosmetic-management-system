export class UserReadModel {
  public constructor(
    public readonly id: string,
    public readonly roleId: string,
    public readonly isActive: boolean,
  ) {}
}
