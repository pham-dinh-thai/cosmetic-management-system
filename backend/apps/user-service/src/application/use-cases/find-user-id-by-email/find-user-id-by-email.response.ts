export class FindUserIdByEmailResponse {
  public constructor(
    public readonly id: string,
    public readonly roleId: string,
  ) {}
}
