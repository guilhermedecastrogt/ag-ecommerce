import { Injectable } from '@nestjs/common';
import { OrdersPrismaService } from '../../../orders-prisma.service';
import { KnownUserEntity } from '../../domain/entities/known-user.entity';
import { KnownUsersRepository } from '../../domain/repositories/known-users.repository';

@Injectable()
export class PrismaKnownUsersRepository implements KnownUsersRepository {
  constructor(private readonly prisma: OrdersPrismaService) {}

  async findById(id: number): Promise<KnownUserEntity | null> {
    const user = await this.prisma.knownUser.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return new KnownUserEntity(user.id, user.name, user.email, user.createdAt);
  }

  async upsert(user: KnownUserEntity): Promise<void> {
    await this.prisma.knownUser.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      update: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  }
}
