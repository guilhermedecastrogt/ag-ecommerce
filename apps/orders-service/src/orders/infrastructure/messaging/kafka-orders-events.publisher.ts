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
        total: order.total,
        createdAt: order.createdAt.toISOString(),
      }),
    );
  }
}
