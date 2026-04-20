import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type { CreatePaymentInput } from '../dtos/create-payment.dto';
import type { PaymentResponseDto } from '../dtos/payment-response.dto';
import type { PaymentsEventsPublisher } from '../ports/payments-events.publisher';
import type { PaymentsRepository } from '../../domain/repositories/payments.repository';
import type { PaymentGatewayRegistry } from '../services/payment-gateway.registry';
import { PaymentStatus } from '../../domain/entities/payment-status.enum';
import {
  PAYMENT_GATEWAY_REGISTRY,
  PAYMENTS_EVENTS_PUBLISHER,
  PAYMENTS_REPOSITORY,
} from '../../tokens';

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    @Inject(PAYMENTS_REPOSITORY)
    private readonly paymentsRepository: PaymentsRepository,
    @Inject(PAYMENT_GATEWAY_REGISTRY)
    private readonly gatewayRegistry: PaymentGatewayRegistry,
    @Inject(PAYMENTS_EVENTS_PUBLISHER)
    private readonly eventsPublisher: PaymentsEventsPublisher,
  ) {}

  async execute(input: CreatePaymentInput): Promise<PaymentResponseDto> {
    const existing = await this.paymentsRepository.findByOrderId(input.orderId);
    if (existing) {
      throw new ConflictException(
        `Payment already exists for order ${input.orderId}`,
      );
    }

    const provider = input.provider ?? 'pagarme';
    const gateway = this.gatewayRegistry.get(provider);

    const result = await gateway.createCharge({
      orderId: input.orderId,
      amount: input.amount,
      method: input.method,
      customer: input.customer,
      items: input.items,
      successUrl: process.env.PAYMENT_SUCCESS_URL,
      cancelUrl: process.env.PAYMENT_CANCEL_URL,
    });

    const payment = await this.paymentsRepository.create({
      orderId: input.orderId,
      provider,
      externalId: result.externalId,
      method: input.method,
      status: PaymentStatus.PENDING,
      amount: input.amount,
      pixQrCode: result.pixQrCode ?? null,
      pixQrCodeUrl: result.pixQrCodeUrl ?? null,
      pixExpiresAt: result.pixExpiresAt ?? null,
      boletoUrl: result.boletoUrl ?? null,
      boletoBarcode: result.boletoBarcode ?? null,
      boletoExpiresAt: result.boletoExpiresAt ?? null,
      checkoutUrl: result.checkoutUrl ?? null,
    });

    await this.eventsPublisher.publishPaymentInitiated({
      paymentId: payment.id,
      orderId: payment.orderId,
      method: payment.method,
      amount: payment.amount,
    });

    return {
      id: payment.id,
      orderId: payment.orderId,
      method: payment.method,
      status: payment.status,
      pixQrCode: payment.pixQrCode ?? undefined,
      pixQrCodeUrl: payment.pixQrCodeUrl ?? undefined,
      pixExpiresAt: payment.pixExpiresAt?.toISOString() ?? undefined,
      boletoUrl: payment.boletoUrl ?? undefined,
      boletoBarcode: payment.boletoBarcode ?? undefined,
      boletoExpiresAt: payment.boletoExpiresAt?.toISOString() ?? undefined,
      checkoutUrl: payment.checkoutUrl ?? undefined,
    };
  }
}
