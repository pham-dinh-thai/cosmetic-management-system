export interface IDeleteUserPort {
  execute(userId: string): Promise<boolean>;
}

export const DELETE_USER_PORT = 'IDeleteUserPort';
