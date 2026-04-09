import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { USERS_EVENTS_PUBLISHER, USERS_REPOSITORY } from '../../tokens';
import type { UsersRepository } from '../../domain/repositories/users.repository';
import type { UsersEventsPublisher } from '../ports/users-events.publisher';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
    @Inject(USERS_EVENTS_PUBLISHER)
    private readonly usersEventsPublisher: UsersEventsPublisher,
  ) {}

  async execute(input: { id?: number; name: string; email: string }): Promise<UserEntity> {
    const createdUser = await this.usersRepository.create(input);
    await this.usersEventsPublisher.publishUserCreated(createdUser);
    return createdUser;
  }
}
