import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersServiceController } from './users-service.controller';
import { UsersPrismaService } from './users-prisma.service';
import { CreateUserUseCase } from './users/application/use-cases/create-user.use-case';
import { FindAllUsersUseCase } from './users/application/use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from './users/application/use-cases/find-user-by-id.use-case';
import { USERS_EVENTS_PUBLISHER, USERS_REPOSITORY } from './users/tokens';
import { KafkaUsersEventsPublisher } from './users/infrastructure/messaging/kafka-users-events.publisher';
import { PrismaUsersRepository } from './users/infrastructure/persistence/prisma-users.repository';

@Module({
  imports: [
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
  controllers: [UsersServiceController],
  providers: [
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
