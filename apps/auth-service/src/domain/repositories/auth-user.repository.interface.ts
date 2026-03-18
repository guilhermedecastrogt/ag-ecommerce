import { AuthUser } from '../entities/auth-user.entity';

export const I_AUTH_USER_REPOSITORY = 'IAuthUserRepository';

export interface IAuthUserRepository {
  findById(id: number): Promise<AuthUser | null>;
  findByEmail(email: string): Promise<AuthUser | null>;
  create(
    user: Omit<AuthUser, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AuthUser>;
  update(id: number, data: Partial<AuthUser>): Promise<AuthUser>;
}
