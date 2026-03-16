import { UserEntity } from '../../domain/entities/user.entity';

export interface UsersEventsPublisher {
  publishUserCreated(user: UserEntity): Promise<void>;
}
