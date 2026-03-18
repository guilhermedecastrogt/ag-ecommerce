export const I_PASSWORD_HASHER = 'IPasswordHasher';

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}
