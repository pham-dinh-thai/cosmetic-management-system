export interface IFindUserInformationPort {
  execute(userId: string): Promise<{
    firstName: string;
    lastName: string;
    gender: string;
    email?: string;
    isActive?: boolean;
  }>;
}

export const FIND_USER_INFORMATION_PORT = 'IFindUserInformationPort';
