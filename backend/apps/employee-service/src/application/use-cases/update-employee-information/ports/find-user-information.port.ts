export interface IFindUserInformationPort {
  execute(userId: string): Promise<{
    firstName: string;
    lastName: string;
    gender: string;
  }>;
}

export const FIND_USER_INFORMATION_PORT = 'IFindUserInformationPort';
