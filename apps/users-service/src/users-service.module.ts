import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from 'nestjs-pino';
import { ClsModule } from 'nestjs-cls';
import { UsersPrismaService } from './users-prisma.service';
import { CorrelationInterceptor } from './common/interceptors/correlation.interceptor';
import { HealthModule } from './health/health.module';
import { CreateUserUseCase } from './users/application/use-cases/create-user.use-case';
import { FindAllUsersUseCase } from './users/application/use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from './users/application/use-cases/find-user-by-id.use-case';
import { USERS_EVENTS_PUBLISHER, USERS_REPOSITORY } from './users/tokens';
import { KafkaUsersEventsPublisher } from './users/infrastructure/messaging/kafka-users-events.publisher';
import { PrismaUsersRepository } from './users/infrastructure/persistence/prisma-users.repository';
import { UsersController } from './users/presentation/controllers/users.controller';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        customProps: () => ({ service: 'users-service' }),
      },
    }),
    ClsModule.forRoot({ global: true }),
    HealthModule,
    ClientsModule.register([
      {
        name: 'USERS_KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'users-service',
            brokers: [process.env.KAFKA_BROKER ?? 'kafka:9092'],
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: CorrelationInterceptor },
    UsersPrismaService,
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindUserByIdUseCase,
    PrismaUsersRepository,
    KafkaUsersEventsPublisher,
    {
      provide: USERS_REPOSITORY,
      useExisting: PrismaUsersRepository,
    },
    {
      provide: USERS_EVENTS_PUBLISHER,
      useExisting: KafkaUsersEventsPublisher,
    },
  ],
})
export class UsersServiceModule {}
