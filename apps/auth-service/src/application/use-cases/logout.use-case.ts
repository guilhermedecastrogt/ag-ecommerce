import { Injectable, Inject } from '@nestjs/common';
import {
  type IRefreshSessionRepository,
  I_REFRESH_SESSION_REPOSITORY,
} from '../../domain/repositories/refresh-session.repository.interface';
import {
  type IJwtService,
  I_JWT_SERVICE,
} from '../interfaces/jwt-service.interface';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(I_REFRESH_SESSION_REPOSITORY)
    private readonly sessionRepository: IRefreshSessionRepository,
    @Inject(I_JWT_SERVICE) private readonly jwtService: IJwtService,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    try {
      const payload = await this.jwtService.verifyRefreshToken(refreshToken);
      if (payload && payload.jti) {
        await this.sessionRepository.revoke(payload.jti);
      }
    } catch {
      // Ignore errors for invalid tokens during logout
    }
  }
}
