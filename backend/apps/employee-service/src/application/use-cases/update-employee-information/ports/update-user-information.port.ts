export interface IUpdateUserInformationRequest {
  firstName: string;
  lastName: string;
  gender: string;
  roleId: string;
}

export interface IUpdateUserInformationPort {
  execute(request: IUpdateUserInformationRequest): Promise<void>;
}

export const UPDATE_USER_INFORMATION_PORT = 'IUpdateUserInformationPort';
