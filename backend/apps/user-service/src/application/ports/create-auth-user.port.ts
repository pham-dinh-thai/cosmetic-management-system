export interface ICreateAuthUserRequest {
  userId: string;
  password: string;
}

export interface ICreateAuthUserPort {
  execute(request: ICreateAuthUserRequest): Promise<void>;
}

export const CREATE_AUTH_USER_PORT = 'ICreateAuthUserPort';
