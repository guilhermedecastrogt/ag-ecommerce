import { Injectable } from '@nestjs/common';
import { OrdersPrismaService } from '../../../orders-prisma.service';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrdersRepository } from '../../domain/repositories/orders.repository';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prisma: OrdersPrismaService) {}

  async create(data: { userId: number; total: number }): Promise<OrderEntity> {
    const created = await this.prisma.order.create({
      data: {
        userId: data.userId,
        total: data.total,
      },
    });

    return new OrderEntity(
      created.id,
      created.userId,
      created.total,
      created.createdAt,
    );
  }

  async findAll(): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    return orders.map(
      (order) =>
        new OrderEntity(order.id, order.userId, order.total, order.createdAt),
    );
  }
}
