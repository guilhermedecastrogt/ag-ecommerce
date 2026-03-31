import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from 'nestjs-pino';
import { ClsModule } from 'nestjs-cls';
import { OrdersPrismaService } from './orders-prisma.service';
import { CorrelationInterceptor } from './common/interceptors/correlation.interceptor';
import { HealthModule } from './health/health.module';
import { CreateOrderUseCase } from './orders/application/use-cases/create-order.use-case';
import { FindAllOrdersUseCase } from './orders/application/use-cases/find-all-orders.use-case';
import { FindOrdersByUserUseCase } from './orders/application/use-cases/find-orders-by-user.use-case';
import { CancelOrderUseCase } from './orders/application/use-cases/cancel-order.use-case';
import { SyncKnownUserUseCase } from './orders/application/use-cases/sync-known-user.use-case';
import { UpdateOrderStatusUseCase } from './orders/application/use-cases/update-order-status.use-case';
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
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        customProps: () => ({ service: 'orders-service' }),
      },
    }),
    ClsModule.forRoot({ global: true }),
    HealthModule,
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
    { provide: APP_INTERCEPTOR, useClass: CorrelationInterceptor },
    OrdersPrismaService,
    CreateOrderUseCase,
    FindAllOrdersUseCase,
    FindOrdersByUserUseCase,
    CancelOrderUseCase,
    SyncKnownUserUseCase,
    UpdateOrderStatusUseCase,
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
