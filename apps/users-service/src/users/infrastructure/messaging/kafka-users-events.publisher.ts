import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserEntity } from '../../domain/entities/user.entity';
import { UsersEventsPublisher } from '../../application/ports/users-events.publisher';

@Injectable()
export class KafkaUsersEventsPublisher
  implements UsersEventsPublisher, OnModuleInit
{
  constructor(
    @Inject('USERS_KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
  }

  async publishUserCreated(user: UserEntity): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit('users.user-created.v1', {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
      }),
    );
  }
}
