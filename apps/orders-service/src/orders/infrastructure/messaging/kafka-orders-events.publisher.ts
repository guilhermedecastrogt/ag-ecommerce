import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { OrdersEventsPublisher } from '../../application/ports/orders-events.publisher';
import { OrderEntity } from '../../domain/entities/order.entity';

@Injectable()
export class KafkaOrdersEventsPublisher
  implements OrdersEventsPublisher, OnModuleInit
{
  constructor(
    @Inject('ORDERS_KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
  }

  async publishOrderCreated(order: OrderEntity): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit('orders.order-created.v1', {
        id: order.id,
        userId: order.userId,
        status: order.status,
        subTotal: order.subTotal,
        shippingFee: order.shippingFee,
        discount: order.discount,
        total: order.total,
        items: order.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        createdAt: order.createdAt.toISOString(),
      }),
    );
  }

  async publishOrderCancelled(order: OrderEntity): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit('orders.order-cancelled.v1', {
        id: order.id,
        userId: order.userId,
        status: order.status,
        total: order.total,
        cancelledAt: order.updatedAt.toISOString(),
      }),
    );
  }

  async publishOrderPaid(order: OrderEntity): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit('order.paid', {
        orderId: order.id,
        userId: order.userId,
        items: order.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        addressSnapshot: order.addressSnapshot,
        shippingFee: order.shippingFee,
        total: order.total,
        paidAt: order.updatedAt.toISOString(),
      }),
    );
  }
}
