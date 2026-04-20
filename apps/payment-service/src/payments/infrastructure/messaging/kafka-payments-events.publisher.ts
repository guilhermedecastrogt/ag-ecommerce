import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type { PaymentsEventsPublisher } from '../../application/ports/payments-events.publisher';

@Injectable()
export class KafkaPaymentsEventsPublisher
  implements PaymentsEventsPublisher, OnModuleInit
{
  constructor(
    @Inject('PAYMENTS_KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
  }

  async publishPaymentInitiated(data: {
    paymentId: number;
    orderId: number;
    method: string;
    amount: number;
  }): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit('payments.payment-initiated.v1', data),
    );
  }

  async publishPaymentApproved(data: {
    orderId: number;
    externalId: string;
    paidAt: string;
  }): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit('payments.payment-approved.v1', data),
    );
  }

  async publishPaymentFailed(data: {
    orderId: number;
    reason: string;
  }): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit('payments.payment-failed.v1', data),
    );
  }
}
