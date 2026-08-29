export class RoleReadModel {
  public constructor(
    public readonly id: string,
    public readonly name: string,
  ) {}
}

export interface IRoleReaderPort {
  findById(id: string): Promise<RoleReadModel | null>;
}

export const ROLE_READER_PORT = 'IRoleReaderPort';
