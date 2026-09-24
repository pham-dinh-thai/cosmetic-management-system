export class FindUserByEmailReadModel {
  public constructor(
    public readonly id: string,
    public readonly roleId: string,
    public readonly isActive: boolean,
  ) {}
}

export interface IFindUserByEmailPort {
  execute(email: string): Promise<FindUserByEmailReadModel | null>;
}

export const FIND_USER_BY_EMAIL_PORT = 'IFindUserByEmailPort';
