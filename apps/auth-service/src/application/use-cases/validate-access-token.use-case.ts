import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import {
  type IJwtService,
  I_JWT_SERVICE,
} from '../interfaces/jwt-service.interface';
import {
  type IAuthUserRepository,
  I_AUTH_USER_REPOSITORY,
} from '../../domain/repositories/auth-user.repository.interface';

@Injectable()
export class ValidateAccessTokenUseCase {
  constructor(
    @Inject(I_JWT_SERVICE) private readonly jwtService: IJwtService,
    @Inject(I_AUTH_USER_REPOSITORY)
    private readonly userRepository: IAuthUserRepository,
  ) {}

  async execute(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAccessToken(token);

      // Optional: verify user is still active in the database for defense-in-depth
      const user = await this.userRepository.findById(payload.sub);
      if (!user || user.status !== 'ACTIVE') {
        throw new UnauthorizedException('User is not active');
      }

      return payload;
    } catch (e) {
      throw new UnauthorizedException('Invalid access token');
    }
  }
}
