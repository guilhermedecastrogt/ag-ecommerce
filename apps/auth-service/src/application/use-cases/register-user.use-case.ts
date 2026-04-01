import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/register-user.dto';
import {
  I_AUTH_USER_REPOSITORY,
  type IAuthUserRepository,
} from '../../domain/repositories/auth-user.repository.interface';
import {
  type IPasswordHasher,
  I_PASSWORD_HASHER,
} from '../interfaces/password-hasher.interface';
import {
  type IEventPublisher,
  I_EVENT_PUBLISHER,
} from '../interfaces/event-publisher.interface';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(I_AUTH_USER_REPOSITORY)
    private readonly userRepository: IAuthUserRepository,
    @Inject(I_PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher,
    @Inject(I_EVENT_PUBLISHER) private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(dto: RegisterUserDto): Promise<{ id: number; email: string }> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await this.passwordHasher.hash(dto.password);

    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      status: 'ACTIVE',
      role: 'USER',
    });

    this.eventPublisher.publish('auth.user-registered.v1', {
      id: user.id,
      email: user.email,
    });

    return { id: user.id, email: user.email };
  }
}
