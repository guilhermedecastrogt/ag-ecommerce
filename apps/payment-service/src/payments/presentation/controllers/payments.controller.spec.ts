import { PaymentsController } from './payments.controller';
import { CreatePaymentUseCase } from '../../application/use-cases/create-payment.use-case';
import { ProcessWebhookUseCase } from '../../application/use-cases/process-webhook.use-case';
import { PaymentMethod } from '../../domain/entities/payment-method.enum';
import { PaymentStatus } from '../../domain/entities/payment-status.enum';
import type { CreatePaymentInput } from '../../application/dtos/create-payment.dto';
import type { WebhookPayload } from '../../application/use-cases/process-webhook.use-case';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let mockCreateUseCase: jest.Mocked<CreatePaymentUseCase>;
  let mockProcessWebhookUseCase: jest.Mocked<ProcessWebhookUseCase>;

  beforeEach(() => {
    mockCreateUseCase = {
      execute: jest.fn(),
    } as any;

    mockProcessWebhookUseCase = {
      execute: jest.fn(),
    } as any;

    controller = new PaymentsController(mockCreateUseCase, mockProcessWebhookUseCase);
  });

  describe('createPayment', () => {
    it('should delegate to CreatePaymentUseCase and return response', async () => {
      const input: CreatePaymentInput = {
        orderId: 100,
        amount: 5000,
        method: PaymentMethod.PIX,
        customer: {
          name: 'John Doe',
          email: 'john@example.com',
        },
        items: [
          { productId: 'p1', name: 'Product 1', amount: 5000, quantity: 1 },
        ],
      };

      const expectedResponse = {
        id: 1,
        orderId: 100,
        method: PaymentMethod.PIX,
        status: PaymentStatus.PENDING,
        pixQrCode: 'qr-code',
        pixQrCodeUrl: 'https://qr.example.com',
        pixExpiresAt: new Date().toISOString(),
      };

      mockCreateUseCase.execute.mockResolvedValue(expectedResponse);

      const result = await controller.createPayment(input);

      expect(result).toEqual(expectedResponse);
      expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    });
  });

  describe('handleWebhook', () => {
    it('should delegate to ProcessWebhookUseCase', async () => {
      const payload: WebhookPayload = {
        provider: 'pagarme',
        type: 'charge.paid',
        data: { id: 'ext-123' },
      };

      mockProcessWebhookUseCase.execute.mockResolvedValue(undefined);

      await controller.handleWebhook(payload);

      expect(mockProcessWebhookUseCase.execute).toHaveBeenCalledWith(payload);
    });

    it('should handle PagBank webhook', async () => {
      const payload: WebhookPayload = {
        provider: 'pagbank',
        type: 'PAID',
        data: { id: 'pagbank-charge-123', referenceId: 'order-100' },
      };

      mockProcessWebhookUseCase.execute.mockResolvedValue(undefined);

      await controller.handleWebhook(payload);

      expect(mockProcessWebhookUseCase.execute).toHaveBeenCalledWith(payload);
    });
  });
});
