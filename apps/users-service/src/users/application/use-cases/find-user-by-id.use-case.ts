import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../domain/entities/user.entity';
import { USERS_REPOSITORY } from '../../tokens';
import type { UsersRepository } from '../../domain/repositories/users.repository';

@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  execute(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findById(id);
  }
}
