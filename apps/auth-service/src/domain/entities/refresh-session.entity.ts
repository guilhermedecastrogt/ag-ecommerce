export class RefreshSession {
  constructor(
    public readonly id: number,
    public readonly jti: string,
    public readonly userId: number,
    public readonly expiresAt: Date,
    public readonly revokedAt: Date | null,
    public readonly createdAt: Date,
  ) {}
}
