import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersPrismaService } from './orders-prisma.service';
import { CreateOrderUseCase } from './orders/application/use-cases/create-order.use-case';
import { FindAllOrdersUseCase } from './orders/application/use-cases/find-all-orders.use-case';
import { SyncKnownUserUseCase } from './orders/application/use-cases/sync-known-user.use-case';
import { KafkaOrdersEventsPublisher } from './orders/infrastructure/messaging/kafka-orders-events.publisher';
import { PrismaKnownUsersRepository } from './orders/infrastructure/persistence/prisma-known-users.repository';
import { PrismaOrdersRepository } from './orders/infrastructure/persistence/prisma-orders.repository';
import { OrdersController } from './orders/presentation/controllers/orders.controller';
import {
  KNOWN_USERS_REPOSITORY,
  ORDERS_EVENTS_PUBLISHER,
  ORDERS_REPOSITORY,
} from './orders/tokens';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDERS_KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'orders-service',
            brokers: [process.env.KAFKA_BROKER ?? 'kafka:9092'],
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [
    OrdersPrismaService,
    CreateOrderUseCase,
    FindAllOrdersUseCase,
    SyncKnownUserUseCase,
    PrismaOrdersRepository,
    PrismaKnownUsersRepository,
    KafkaOrdersEventsPublisher,
    {
      provide: ORDERS_REPOSITORY,
      useExisting: PrismaOrdersRepository,
    },
    {
      provide: KNOWN_USERS_REPOSITORY,
      useExisting: PrismaKnownUsersRepository,
    },
    {
      provide: ORDERS_EVENTS_PUBLISHER,
      useExisting: KafkaOrdersEventsPublisher,
    },
  ],
})
export class OrdersServiceModule {}
