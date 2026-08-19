export interface IPasswordHasherPort {
  hash(plainText: string, saltOrRounds?: number | string): Promise<string>;
}

export const PASSWORD_HASHER_PORT = 'IPasswordHasherPort';
