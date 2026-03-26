import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { IAuthUserRepository } from '../../domain/repositories/auth-user.repository.interface';
import { AuthUser } from '../../domain/entities/auth-user.entity';

@Injectable()
export class PrismaAuthUserRepository implements IAuthUserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: number): Promise<AuthUser | null> {
    const user = await this.prisma.authUser.findUnique({ where: { id } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async findByEmail(email: string): Promise<AuthUser | null> {
    const user = await this.prisma.authUser.findUnique({ where: { email } });
    if (!user) return null;
    return this.mapToDomain(user);
  }

  async create(
    data: Omit<AuthUser, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<AuthUser> {
    const user = await this.prisma.authUser.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        status: data.status,
      },
    });
    return this.mapToDomain(user);
  }

  async update(id: number, data: Partial<AuthUser>): Promise<AuthUser> {
    const user = await this.prisma.authUser.update({
      where: { id },
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        status: data.status,
      },
    });
    return this.mapToDomain(user);
  }

  private mapToDomain(prismaUser: {
    id: number;
    email: string;
    passwordHash: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): AuthUser {
    return new AuthUser(
      prismaUser.id,
      prismaUser.email,
      prismaUser.passwordHash,
      prismaUser.status,
      prismaUser.createdAt,
      prismaUser.updatedAt,
    );
  }
}
