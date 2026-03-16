import { Inject, Injectable } from '@nestjs/common';
import { KnownUserEntity } from '../../domain/entities/known-user.entity';
import { KNOWN_USERS_REPOSITORY } from '../../tokens';
import type { KnownUsersRepository } from '../../domain/repositories/known-users.repository';

@Injectable()
export class SyncKnownUserUseCase {
  constructor(
    @Inject(KNOWN_USERS_REPOSITORY)
    private readonly knownUsersRepository: KnownUsersRepository,
  ) {}

  async execute(input: {
    id: number;
    name: string;
    email: string;
    createdAt: string;
  }): Promise<void> {
    await this.knownUsersRepository.upsert(
      new KnownUserEntity(
        input.id,
        input.name,
        input.email,
        new Date(input.createdAt),
      ),
    );
  }
}
