import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { USERS_REPOSITORY } from '../../tokens';
import type { UsersRepository } from '../../domain/repositories/users.repository';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  execute(): Promise<UserEntity[]> {
    return this.usersRepository.findAll();
  }
}
