import { NotFoundException } from '@nestjs/common';
import { ProcessWebhookUseCase, WebhookPayload } from './process-webhook.use-case';
import { PaymentMethod } from '../../domain/entities/payment-method.enum';
import { PaymentStatus } from '../../domain/entities/payment-status.enum';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import type { PaymentsRepository } from '../../domain/repositories/payments.repository';
import type { PaymentsEventsPublisher } from '../ports/payments-events.publisher';

describe('ProcessWebhookUseCase', () => {
  let useCase: ProcessWebhookUseCase;
  let mockRepository: jest.Mocked<PaymentsRepository>;
  let mockEventsPublisher: jest.Mocked<PaymentsEventsPublisher>;

  const now = new Date();
  const existingPayment = new PaymentEntity(
    1, 100, 'pagarme', 'ext-123', PaymentMethod.PIX, PaymentStatus.PENDING,
    5000, 'qr', 'https://qr.example.com', now,
    null, null, null, null, null, null, now, now,
  );

  const updatedPaidPayment = new PaymentEntity(
    1, 100, 'pagarme', 'ext-123', PaymentMethod.PIX, PaymentStatus.PAID,
    5000, 'qr', 'https://qr.example.com', now,
    null, null, null, null, now, '{}', now, now,
  );

  const updatedFailedPayment = new PaymentEntity(
    1, 100, 'pagarme', 'ext-123', PaymentMethod.PIX, PaymentStatus.FAILED,
    5000, 'qr', 'https://qr.example.com', now,
    null, null, null, null, now, '{}', now, now,
  );

  beforeEach(() => {
    mockRepository = {
      findByOrderId: jest.fn(),
      findByExternalId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    mockEventsPublisher = {
      publishPaymentInitiated: jest.fn().mockResolvedValue(undefined),
      publishPaymentApproved: jest.fn().mockResolvedValue(undefined),
      publishPaymentFailed: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new ProcessWebhookUseCase(mockRepository, mockEventsPublisher);
  });

  it('should throw NotFoundException when payment is not found', async () => {
    mockRepository.findByExternalId.mockResolvedValue(null);

    const payload: WebhookPayload = {
      provider: 'pagarme',
      type: 'charge.paid',
      data: { id: 'unknown-id' },
    };

    await expect(useCase.execute(payload)).rejects.toThrow(NotFoundException);
    expect(mockRepository.findByExternalId).toHaveBeenCalledWith('unknown-id');
  });

  // ─── Pagar.me approved events ──────────────────────────────────────────────
  describe('Pagar.me approved events', () => {
    it.each(['charge.paid', 'order.paid', 'charge.captured'])(
      'should mark payment as PAID for type "%s"',
      async (type) => {
        mockRepository.findByExternalId.mockResolvedValue(existingPayment);
        mockRepository.update.mockResolvedValue(updatedPaidPayment);

        const payload: WebhookPayload = {
          provider: 'pagarme',
          type,
          data: { id: 'ext-123' },
        };

        await useCase.execute(payload);

        expect(mockRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({
          status: PaymentStatus.PAID,
        }));
        expect(mockEventsPublisher.publishPaymentApproved).toHaveBeenCalledWith({
          orderId: 100,
          externalId: 'ext-123',
          paidAt: expect.any(String),
        });
      },
    );
  });

  // ─── Pagar.me failed events ────────────────────────────────────────────────
  describe('Pagar.me failed events', () => {
    it.each(['charge.payment_failed', 'charge.chargedback', 'charge.refunded'])(
      'should mark payment as FAILED for type "%s"',
      async (type) => {
        mockRepository.findByExternalId.mockResolvedValue(existingPayment);
        mockRepository.update.mockResolvedValue(updatedFailedPayment);

        const payload: WebhookPayload = {
          provider: 'pagarme',
          type,
          data: { id: 'ext-123' },
        };

        await useCase.execute(payload);

        expect(mockRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({
          status: PaymentStatus.FAILED,
        }));
        expect(mockEventsPublisher.publishPaymentFailed).toHaveBeenCalledWith({
          orderId: 100,
          reason: type,
        });
      },
    );
  });

  // ─── PagBank approved events ───────────────────────────────────────────────
  describe('PagBank approved events', () => {
    it.each(['PAID', 'AVAILABLE', 'AUTHORIZED'])(
      'should mark payment as PAID for PagBank type "%s"',
      async (type) => {
        mockRepository.findByExternalId.mockResolvedValue(existingPayment);
        mockRepository.update.mockResolvedValue(updatedPaidPayment);

        const payload: WebhookPayload = {
          provider: 'pagbank',
          type,
          data: { id: 'ext-123' },
        };

        await useCase.execute(payload);

        expect(mockRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({
          status: PaymentStatus.PAID,
        }));
        expect(mockEventsPublisher.publishPaymentApproved).toHaveBeenCalled();
      },
    );
  });

  // ─── PagBank failed events ────────────────────────────────────────────────
  describe('PagBank failed events', () => {
    it.each(['DECLINED', 'CANCELED', 'CHARGEBACK'])(
      'should mark payment as FAILED for PagBank type "%s"',
      async (type) => {
        mockRepository.findByExternalId.mockResolvedValue(existingPayment);
        mockRepository.update.mockResolvedValue(updatedFailedPayment);

        const payload: WebhookPayload = {
          provider: 'pagbank',
          type,
          data: { id: 'ext-123' },
        };

        await useCase.execute(payload);

        expect(mockRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({
          status: PaymentStatus.FAILED,
        }));
        expect(mockEventsPublisher.publishPaymentFailed).toHaveBeenCalledWith({
          orderId: 100,
          reason: type,
        });
      },
    );
  });

  // ─── Unknown event type (no status change) ────────────────────────────────
  it('should update webhook timestamp without changing status for unknown event types', async () => {
    mockRepository.findByExternalId.mockResolvedValue(existingPayment);
    mockRepository.update.mockResolvedValue(existingPayment);

    const payload: WebhookPayload = {
      provider: 'pagarme',
      type: 'charge.created',
      data: { id: 'ext-123' },
    };

    await useCase.execute(payload);

    expect(mockRepository.update).toHaveBeenCalledWith(1, expect.objectContaining({
      lastWebhookAt: expect.any(Date),
      webhookPayload: expect.any(String),
    }));
    expect(mockRepository.update).toHaveBeenCalledWith(1, expect.not.objectContaining({
      status: expect.anything(),
    }));
    expect(mockEventsPublisher.publishPaymentApproved).not.toHaveBeenCalled();
    expect(mockEventsPublisher.publishPaymentFailed).not.toHaveBeenCalled();
  });
});
