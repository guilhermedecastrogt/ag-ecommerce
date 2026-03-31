import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from '../dtos/login-user.dto';
import { TokenResponseDto } from '../dtos/token-response.dto';
import {
  type IAuthUserRepository,
  I_AUTH_USER_REPOSITORY,
} from '../../domain/repositories/auth-user.repository.interface';
import {
  type IRefreshSessionRepository,
  I_REFRESH_SESSION_REPOSITORY,
} from '../../domain/repositories/refresh-session.repository.interface';
import {
  type IPasswordHasher,
  I_PASSWORD_HASHER,
} from '../interfaces/password-hasher.interface';
import {
  type IJwtService,
  I_JWT_SERVICE,
} from '../interfaces/jwt-service.interface';
import {
  type IEventPublisher,
  I_EVENT_PUBLISHER,
} from '../interfaces/event-publisher.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(I_AUTH_USER_REPOSITORY)
    private readonly userRepository: IAuthUserRepository,
    @Inject(I_REFRESH_SESSION_REPOSITORY)
    private readonly sessionRepository: IRefreshSessionRepository,
    @Inject(I_PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher,
    @Inject(I_JWT_SERVICE) private readonly jwtService: IJwtService,
    @Inject(I_EVENT_PUBLISHER) private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(dto: LoginUserDto): Promise<TokenResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordHasher.verify(
      dto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User is not active');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAccessToken(payload);

    const jti = randomUUID();
    const refreshToken = await this.jwtService.signRefreshToken(payload, jti);

    // Refresh token expiry length should match the JWT config. Assuming 7 days here.
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionRepository.create({
      jti,
      userId: user.id,
      expiresAt,
      revokedAt: null,
    });

    this.eventPublisher.publish('auth.user-logged-in.v1', {
      userId: user.id,
      sessionJti: jti,
    });

    return { accessToken, refreshToken };
  }
}
