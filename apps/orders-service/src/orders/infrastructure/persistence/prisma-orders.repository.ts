import { Injectable } from '@nestjs/common';
import { OrdersPrismaService } from '../../../orders-prisma.service';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderItemEntity } from '../../domain/entities/order-item.entity';
import { OrderStatus } from '../../domain/entities/order-status.enum';
import {
  CreateOrderInput,
  OrdersRepository,
} from '../../domain/repositories/orders.repository';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prisma: OrdersPrismaService) {}

  async create(data: CreateOrderInput): Promise<OrderEntity> {
    const created = await this.prisma.order.create({
      data: {
        userId: data.userId,
        status: data.status,
        subTotal: data.subTotal,
        shippingFee: data.shippingFee,
        discount: data.discount,
        total: data.total,
        addressSnapshot: data.addressSnapshot,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return this.toDomain(created);
  }

  async findAll(): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.toDomain(order));
  }

  async findById(id: number): Promise<OrderEntity | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) return null;
    return this.toDomain(order);
  }

  async findByUserId(userId: number): Promise<OrderEntity[]> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.toDomain(order));
  }

  async updateStatus(id: number, status: OrderStatus): Promise<OrderEntity> {
    const updated = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });

    return this.toDomain(updated);
  }

  private toDomain(record: {
    id: number;
    userId: number;
    status: string;
    subTotal: number;
    shippingFee: number;
    discount: number;
    total: number;
    addressSnapshot: string | null;
    createdAt: Date;
    updatedAt: Date;
    items: {
      id: number;
      orderId: number;
      productId: string;
      name: string;
      price: number;
      quantity: number;
    }[];
  }): OrderEntity {
    const items = record.items.map(
      (item) =>
        new OrderItemEntity(
          item.id,
          item.orderId,
          item.productId,
          item.name,
          item.price,
          item.quantity,
        ),
    );

    return new OrderEntity(
      record.id,
      record.userId,
      record.status as OrderStatus,
      record.subTotal,
      record.shippingFee,
      record.discount,
      record.total,
      items,
      record.addressSnapshot,
      record.createdAt,
      record.updatedAt,
    );
  }
}
