import { Injectable } from '@nestjs/common';
import { UsersPrismaService } from './users-prisma.service';

@Injectable()
export class UsersServiceService {
  constructor(private readonly prisma: UsersPrismaService) {}

  create(data: { name: string; email: string }) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }

  findById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
