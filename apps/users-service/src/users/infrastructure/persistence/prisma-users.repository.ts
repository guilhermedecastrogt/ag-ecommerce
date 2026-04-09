import { Injectable } from '@nestjs/common';
import { UsersPrismaService } from '../../../users-prisma.service';
import { UserEntity } from '../../domain/entities/user.entity';
import { UsersRepository } from '../../domain/repositories/users.repository';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: UsersPrismaService) {}

  async create(data: { id?: number; name: string; email: string }): Promise<UserEntity> {
    const created = await this.prisma.user.create({
      data: {
        ...(data.id !== undefined && { id: data.id }),
        name: data.name,
        email: data.email,
      },
    });

    return new UserEntity(
      created.id,
      created.name,
      created.email,
      created.createdAt,
    );
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return users.map(
      (user) => new UserEntity(user.id, user.name, user.email, user.createdAt),
    );
  }

  async findById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return new UserEntity(user.id, user.name, user.email, user.createdAt);
  }
}
