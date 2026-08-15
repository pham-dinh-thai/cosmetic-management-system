export interface PasswordHasherPort {
  hash(password: string): Promise<string>;
}

export const PASSWORD_HASHER_PORT = 'PasswordHasherPort';
