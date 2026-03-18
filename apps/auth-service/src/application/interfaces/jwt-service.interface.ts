export const I_JWT_SERVICE = 'IJwtService';

export interface IJwtService {
  signAccessToken(payload: any): Promise<string>;
  signRefreshToken(payload: any, jti: string): Promise<string>;
  verifyAccessToken(token: string): Promise<any>;
  verifyRefreshToken(token: string): Promise<any>;
}
