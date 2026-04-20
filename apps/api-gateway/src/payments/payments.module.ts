import { Module, OnModuleInit, Inject } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMENTS_KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'api-gateway-payments',
            brokers: [process.env.KAFKA_BROKER ?? 'kafka:9092'],
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [PaymentsController],
})
export class PaymentsModule implements OnModuleInit {
  constructor(
    @Inject('PAYMENTS_KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }
}
