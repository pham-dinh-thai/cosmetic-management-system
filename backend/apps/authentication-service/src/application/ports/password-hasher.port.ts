export interface IPasswordHasherPort {
  hash(plainText: string, saltOrRounds?: number | string): Promise<string>;

  compare(plainText: string, hash: string): Promise<boolean>;
}

export const PASSWORD_HASHER_PORT = 'IPasswordHasherPort';
