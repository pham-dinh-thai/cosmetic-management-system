export interface CheckUserExistsPort {
  isEmailTaken(email: string): Promise<boolean>;
}

export const CHECK_USER_EXISTS = 'CheckUserExistsPort';
