import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
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
import {
  type IRefreshSessionRepository,
  I_REFRESH_SESSION_REPOSITORY,
} from '../../domain/repositories/refresh-session.repository.interface';
import {
  type IJwtService,
  I_JWT_SERVICE,
} from '../interfaces/jwt-service.interface';
import { TokenResponseDto } from '../dtos/token-response.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(I_AUTH_USER_REPOSITORY)
    private readonly userRepository: IAuthUserRepository,
    @Inject(I_PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher,
    @Inject(I_EVENT_PUBLISHER) private readonly eventPublisher: IEventPublisher,
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    @Inject(I_REFRESH_SESSION_REPOSITORY)
    private readonly sessionRepository: IRefreshSessionRepository,
    @Inject(I_JWT_SERVICE) private readonly jwtService: IJwtService,
  ) {}

  async execute(dto: RegisterUserDto): Promise<TokenResponseDto> {
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

    // Create the user profile in users-service so KnownUser gets synced
    try {
      await firstValueFrom(
        this.usersClient.send('users.create', {
          id: user.id,
          name: dto.name,
          email: dto.email,
        }),
      );
    } catch {
      // Non-critical: profile creation failure should not block registration
    }

    this.eventPublisher.publish('auth.user-registered.v1', {
      id: user.id,
      email: user.email,
    });

    // Generate tokens so the caller can be immediately authenticated
    const jwtPayload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAccessToken(jwtPayload);

    const jti = randomUUID();
    const refreshToken = await this.jwtService.signRefreshToken(jwtPayload, jti);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionRepository.create({
      jti,
      userId: user.id,
      expiresAt,
      revokedAt: null,
    });

    return { accessToken, refreshToken };
  }
}
