import {
  Injectable,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { IEventPublisher } from '../../application/interfaces/event-publisher.interface';

@Injectable()
export class KafkaEventPublisher
  implements IEventPublisher, OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    // Only connect the producer since we are not consuming anything yet
    await this.kafkaClient.connect();
  }

  async onModuleDestroy() {
    await this.kafkaClient.close();
  }

  publish(topic: string, data: any): void {
    this.kafkaClient.emit(topic, data);
  }
}
