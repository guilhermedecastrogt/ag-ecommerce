import { Injectable } from '@nestjs/common';
import { OrdersPrismaService } from './orders-prisma.service';

@Injectable()
export class OrdersServiceService {
  constructor(private readonly prisma: OrdersPrismaService) {}

  create(data: { userId: number; total: number }) {
    return this.prisma.order.create({
      data: {
        userId: data.userId,
        total: data.total,
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      orderBy: {
        id: 'asc',
      },
    });
  }
}
