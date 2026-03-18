import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IJwtService } from '../../application/interfaces/jwt-service.interface';

@Injectable()
export class JwtServiceWrapper implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async signAccessToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '15m', // Short lived access token
    });
  }

  async signRefreshToken(payload: any, jti: string): Promise<string> {
    return this.jwtService.signAsync(
      { ...payload, jti },
      {
        expiresIn: '7d', // Long lived refresh token
      },
    );
  }

  async verifyAccessToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }

  async verifyRefreshToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
