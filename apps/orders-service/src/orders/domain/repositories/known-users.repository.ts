import { KnownUserEntity } from '../entities/known-user.entity';

export interface KnownUsersRepository {
  findById(id: number): Promise<KnownUserEntity | null>;
  upsert(user: KnownUserEntity): Promise<void>;
}
