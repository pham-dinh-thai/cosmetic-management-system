export interface IUpdateUserInformationRequest {
  firstName: string;
  lastName: string;
  gender: string;
}

export interface IUpdateUserInformationPort {
  execute(id: string, request: IUpdateUserInformationRequest): Promise<void>;
}

export const UPDATE_USER_INFORMATION_PORT = 'IUpdateUserInformationPort';
