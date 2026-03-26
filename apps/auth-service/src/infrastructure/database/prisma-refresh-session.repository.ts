import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IRefreshSessionRepository } from '../../domain/repositories/refresh-session.repository.interface';
import { RefreshSession } from '../../domain/entities/refresh-session.entity';

@Injectable()
export class PrismaRefreshSessionRepository implements IRefreshSessionRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(
    data: Omit<RefreshSession, 'id' | 'createdAt'>,
  ): Promise<RefreshSession> {
    const session = await this.prisma.refreshSession.create({
      data: {
        jti: data.jti,
        userId: data.userId,
        expiresAt: data.expiresAt,
        revokedAt: data.revokedAt,
      },
    });
    return this.mapToDomain(session);
  }

  async findByJti(jti: string): Promise<RefreshSession | null> {
    const session = await this.prisma.refreshSession.findUnique({
      where: { jti },
    });
    if (!session) return null;
    return this.mapToDomain(session);
  }

  async revoke(jti: string): Promise<void> {
    await this.prisma.refreshSession.update({
      where: { jti },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: number): Promise<void> {
    await this.prisma.refreshSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private mapToDomain(prismaSession: {
    id: number;
    jti: string;
    userId: number;
    expiresAt: Date;
    revokedAt: Date | null;
    createdAt: Date;
  }): RefreshSession {
    return new RefreshSession(
      prismaSession.id,
      prismaSession.jti,
      prismaSession.userId,
      prismaSession.expiresAt,
      prismaSession.revokedAt,
      prismaSession.createdAt,
    );
  }
}
