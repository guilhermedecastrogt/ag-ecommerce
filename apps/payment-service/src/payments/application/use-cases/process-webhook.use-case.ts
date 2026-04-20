import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { PaymentsEventsPublisher } from '../ports/payments-events.publisher';
import type { PaymentsRepository } from '../../domain/repositories/payments.repository';
import { PaymentStatus } from '../../domain/entities/payment-status.enum';
import { PAYMENTS_EVENTS_PUBLISHER, PAYMENTS_REPOSITORY } from '../../tokens';

export interface WebhookPayload {
  provider: string; // 'pagarme' | 'pagbank'
  type: string;
  data: {
    id: string; // externalId (Pagar.me order ID ou PagBank charge ID)
    referenceId?: string; // nosso código de pedido, ex: "order-123"
    status?: string;
    [key: string]: unknown;
  };
}

@Injectable()
export class ProcessWebhookUseCase {
  private readonly logger = new Logger(ProcessWebhookUseCase.name);

  constructor(
    @Inject(PAYMENTS_REPOSITORY)
    private readonly paymentsRepository: PaymentsRepository,
    @Inject(PAYMENTS_EVENTS_PUBLISHER)
    private readonly eventsPublisher: PaymentsEventsPublisher,
  ) {}

  async execute(payload: WebhookPayload): Promise<void> {
    const { provider, type, data } = payload;
    this.logger.log(
      `Processing webhook: provider=${provider} type=${type} externalId=${data.id}`,
    );

    const payment = await this.paymentsRepository.findByExternalId(data.id);
    if (!payment) {
      this.logger.warn(`Payment not found for externalId=${data.id}`);
      throw new NotFoundException(
        `Payment not found for externalId=${data.id}`,
      );
    }

    const now = new Date();

    if (this.isApprovedEvent(type, provider)) {
      await this.paymentsRepository.update(payment.id, {
        status: PaymentStatus.PAID,
        lastWebhookAt: now,
        webhookPayload: JSON.stringify(payload),
      });
      await this.eventsPublisher.publishPaymentApproved({
        orderId: payment.orderId,
        externalId: data.id,
        paidAt: now.toISOString(),
      });
      this.logger.log(
        `Payment approved: provider=${provider} orderId=${payment.orderId}`,
      );
      return;
    }

    if (this.isFailedEvent(type, provider)) {
      await this.paymentsRepository.update(payment.id, {
        status: PaymentStatus.FAILED,
        lastWebhookAt: now,
        webhookPayload: JSON.stringify(payload),
      });
      await this.eventsPublisher.publishPaymentFailed({
        orderId: payment.orderId,
        reason: type,
      });
      this.logger.log(
        `Payment failed: provider=${provider} orderId=${payment.orderId}`,
      );
      return;
    }

    await this.paymentsRepository.update(payment.id, {
      lastWebhookAt: now,
      webhookPayload: JSON.stringify(payload),
    });
    this.logger.log(
      `Webhook received (no status change): provider=${provider} type=${type}`,
    );
  }

  private isApprovedEvent(type: string, provider: string): boolean {
    if (provider === 'pagbank') {
      return ['PAID', 'AVAILABLE', 'AUTHORIZED'].includes(type);
    }
    // pagarme
    return ['charge.paid', 'order.paid', 'charge.captured'].includes(type);
  }

  private isFailedEvent(type: string, provider: string): boolean {
    if (provider === 'pagbank') {
      return ['DECLINED', 'CANCELED', 'CHARGEBACK'].includes(type);
    }
    // pagarme
    return [
      'charge.payment_failed',
      'charge.chargedback',
      'charge.refunded',
    ].includes(type);
  }
}
