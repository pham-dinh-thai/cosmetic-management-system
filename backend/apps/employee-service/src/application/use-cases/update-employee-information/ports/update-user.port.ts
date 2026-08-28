export interface IUpdateUserRequest {
  firstName: string;
  lastName: string;
  gender: string;
  roleId: string;
}

export interface IUpdateUserPort {
  execute(request: IUpdateUserRequest): Promise<void>;
}

export const UPDATE_USER_PORT = 'IUpdateUserPort';
