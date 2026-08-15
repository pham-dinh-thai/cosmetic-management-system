export interface IPasswordHasherPort {
  hash(password: string): Promise<string>;
}

export const PASSWORD_HASHER_PORT = 'IPasswordHasherPort';
