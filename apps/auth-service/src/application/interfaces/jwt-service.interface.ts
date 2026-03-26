import { JwtPayload } from './jwt-payload.interface';

export const I_JWT_SERVICE = 'IJwtService';

export interface IJwtService {
  signAccessToken(payload: JwtPayload): Promise<string>;
  signRefreshToken(payload: JwtPayload, jti: string): Promise<string>;
  verifyAccessToken(token: string): Promise<JwtPayload>;
  verifyRefreshToken(token: string): Promise<JwtPayload>;
}
