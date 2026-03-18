import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { TokenResponseDto } from '../dtos/token-response.dto';
import {
  type IRefreshSessionRepository,
  I_REFRESH_SESSION_REPOSITORY,
} from '../../domain/repositories/refresh-session.repository.interface';
import {
  type IAuthUserRepository,
  I_AUTH_USER_REPOSITORY,
} from '../../domain/repositories/auth-user.repository.interface';
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
export class RefreshTokenUseCase {
  constructor(
    @Inject(I_REFRESH_SESSION_REPOSITORY)
    private readonly sessionRepository: IRefreshSessionRepository,
    @Inject(I_AUTH_USER_REPOSITORY)
    private readonly userRepository: IAuthUserRepository,
    @Inject(I_JWT_SERVICE) private readonly jwtService: IJwtService,
    @Inject(I_EVENT_PUBLISHER) private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(token: string): Promise<TokenResponseDto> {
    let payload;
    try {
      payload = await this.jwtService.verifyRefreshToken(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const jti = payload.jti;
    const session = await this.sessionRepository.findByJti(jti);

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    if (session.revokedAt) {
      throw new UnauthorizedException('Session has been revoked');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session has expired');
    }

    const user = await this.userRepository.findById(payload.sub);
    if (!user || user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User is not active or not found');
    }

    // Revoke old session (Rotation)
    await this.sessionRepository.revoke(jti);
    this.eventPublisher.publish('auth.refresh-revoked.v1', {
      userId: user.id,
      sessionJti: jti,
    });

    // Create new tokens
    const newPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAccessToken(newPayload);
    const newJti = randomUUID();
    const refreshToken = await this.jwtService.signRefreshToken(
      newPayload,
      newJti,
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.sessionRepository.create({
      jti: newJti,
      userId: user.id,
      expiresAt,
      revokedAt: null,
    });

    return { accessToken, refreshToken };
  }
}
