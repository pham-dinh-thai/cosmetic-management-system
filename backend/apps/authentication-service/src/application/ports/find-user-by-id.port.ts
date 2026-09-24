export class FindUserByIdReadModel {
  public constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly gender: string,
    public readonly email: string,
    public readonly roleId: string,
    public readonly isActive: boolean,
  ) {}
}

export interface IFindUserByIdPort {
  execute(id: string): Promise<FindUserByIdReadModel | null>;
}

export const FIND_USER_BY_ID_PORT = 'IFindUserByIdPort';
