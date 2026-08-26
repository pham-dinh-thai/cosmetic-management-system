export interface ICreateUserRequest {
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  password: string;
  roleId: string;
}

export interface ICreateUserPort {
  execute(request: ICreateUserRequest): Promise<{ id: string }>;
}

export const CREATE_USER_PORT = 'ICreateUserPort';
