import { RefreshSession } from '../entities/refresh-session.entity';

export const I_REFRESH_SESSION_REPOSITORY = 'IRefreshSessionRepository';

export interface IRefreshSessionRepository {
  create(
    session: Omit<RefreshSession, 'id' | 'createdAt'>,
  ): Promise<RefreshSession>;
  findByJti(jti: string): Promise<RefreshSession | null>;
  revoke(jti: string): Promise<void>;
  revokeAllForUser(userId: number): Promise<void>;
}
