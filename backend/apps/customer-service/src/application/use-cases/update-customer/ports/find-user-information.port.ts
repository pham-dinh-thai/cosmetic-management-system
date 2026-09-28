export type UserInformation = {
  firstName: string;
  lastName: string;
  gender: string;
  email?: string;
  isActive?: boolean;
};

export interface IFindUserInformationPort {
  execute(userId: string): Promise<UserInformation | null>;
}

export const FIND_USER_INFORMATION_PORT = 'IFindUserInformationPort';
