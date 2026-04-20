import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';
import { PaymentPrismaService } from './payment-prisma.service';
import { PaymentsController } from './payments/presentation/controllers/payments.controller';
import { CreatePaymentUseCase } from './payments/application/use-cases/create-payment.use-case';
import { ProcessWebhookUseCase } from './payments/application/use-cases/process-webhook.use-case';
import { PaymentGatewayRegistry } from './payments/application/services/payment-gateway.registry';
import { PagarmeClient } from './payments/infrastructure/pagarme/pagarme-client';
import { PagarmeGatewayAdapter } from './payments/infrastructure/pagarme/pagarme-gateway.adapter';
import { PagBankClient } from './payments/infrastructure/pagbank/pagbank-client';
import { PagBankGatewayAdapter } from './payments/infrastructure/pagbank/pagbank-gateway.adapter';
import { KafkaPaymentsEventsPublisher } from './payments/infrastructure/messaging/kafka-payments-events.publisher';
import { PrismaPaymentsRepository } from './payments/infrastructure/persistence/prisma-payments.repository';
import {
  PAYMENT_GATEWAY_REGISTRY,
  PAYMENTS_EVENTS_PUBLISHER,
  PAYMENTS_REPOSITORY,
} from './payments/tokens';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        customProps: () => ({ service: 'payment-service' }),
      },
    }),
    HealthModule,
    ClientsModule.register([
      {
        name: 'PAYMENTS_KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'payment-service',
            brokers: [process.env.KAFKA_BROKER ?? 'kafka:9092'],
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [PaymentsController],
  providers: [
    PaymentPrismaService,
    // Pagar.me
    PagarmeClient,
    PagarmeGatewayAdapter,
    // PagBank
    PagBankClient,
    PagBankGatewayAdapter,
    // Registry
    PaymentGatewayRegistry,
    // Kafka + Prisma
    KafkaPaymentsEventsPublisher,
    PrismaPaymentsRepository,
    // Use cases
    CreatePaymentUseCase,
    ProcessWebhookUseCase,
    // DI tokens
    {
      provide: PAYMENTS_REPOSITORY,
      useExisting: PrismaPaymentsRepository,
    },
    {
      provide: PAYMENT_GATEWAY_REGISTRY,
      useExisting: PaymentGatewayRegistry,
    },
    {
      provide: PAYMENTS_EVENTS_PUBLISHER,
      useExisting: KafkaPaymentsEventsPublisher,
    },
  ],
})
export class PaymentServiceModule {}
