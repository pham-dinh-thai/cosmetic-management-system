export interface IDeleteAuthUserPort {
  execute(userId: string): Promise<void>;
}

export const DELETE_AUTH_USER_PORT = 'IDeleteAuthUserPort';
