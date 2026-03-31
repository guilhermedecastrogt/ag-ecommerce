export interface JwtPayload {
  sub: number;
  email: string;
  role?: string;
  jti?: string;
}
