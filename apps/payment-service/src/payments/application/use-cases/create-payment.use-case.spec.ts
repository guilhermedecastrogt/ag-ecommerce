import { ConflictException } from '@nestjs/common';
import { CreatePaymentUseCase } from './create-payment.use-case';
import { PaymentMethod } from '../../domain/entities/payment-method.enum';
import { PaymentStatus } from '../../domain/entities/payment-status.enum';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import type { PaymentsRepository } from '../../domain/repositories/payments.repository';
import type { PaymentGatewayRegistry } from '../services/payment-gateway.registry';
import type { PaymentsEventsPublisher } from '../ports/payments-events.publisher';
import type { CreatePaymentInput } from '../dtos/create-payment.dto';

describe('CreatePaymentUseCase', () => {
  let useCase: CreatePaymentUseCase;
  let mockRepository: jest.Mocked<PaymentsRepository>;
  let mockGatewayRegistry: jest.Mocked<PaymentGatewayRegistry>;
  let mockEventsPublisher: jest.Mocked<PaymentsEventsPublisher>;

  const now = new Date();
  const mockPaymentEntity = new PaymentEntity(
    1, 100, 'pagarme', 'ext-123', PaymentMethod.PIX, PaymentStatus.PENDING,
    5000, 'pix-qr-code', 'https://qr.example.com', now,
    null, null, null, null, null, null, now, now,
  );

  const validInput: CreatePaymentInput = {
    orderId: 100,
    amount: 5000,
    method: PaymentMethod.PIX,
    provider: 'pagarme',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      document: '12345678900',
      phone: '11999999999',
    },
    items: [
      { productId: 'p1', name: 'Product 1', amount: 5000, quantity: 1 },
    ],
  };

  beforeEach(() => {
    mockRepository = {
      findByOrderId: jest.fn(),
      findByExternalId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const mockGateway = {
      createCharge: jest.fn().mockResolvedValue({
        externalId: 'ext-123',
        pixQrCode: 'pix-qr-code',
        pixQrCodeUrl: 'https://qr.example.com',
        pixExpiresAt: now,
      }),
    };

    mockGatewayRegistry = {
      get: jest.fn().mockReturnValue(mockGateway),
    } as any;

    mockEventsPublisher = {
      publishPaymentInitiated: jest.fn().mockResolvedValue(undefined),
      publishPaymentApproved: jest.fn().mockResolvedValue(undefined),
      publishPaymentFailed: jest.fn().mockResolvedValue(undefined),
    };

    useCase = new CreatePaymentUseCase(
      mockRepository,
      mockGatewayRegistry,
      mockEventsPublisher,
    );
  });

  it('should create a payment successfully via PIX', async () => {
    mockRepository.findByOrderId.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(mockPaymentEntity);

    const result = await useCase.execute(validInput);

    expect(result).toEqual({
      id: 1,
      orderId: 100,
      method: PaymentMethod.PIX,
      status: PaymentStatus.PENDING,
      pixQrCode: 'pix-qr-code',
      pixQrCodeUrl: 'https://qr.example.com',
      pixExpiresAt: now.toISOString(),
    });

    expect(mockRepository.findByOrderId).toHaveBeenCalledWith(100);
    expect(mockGatewayRegistry.get).toHaveBeenCalledWith('pagarme');
    expect(mockRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 100,
        provider: 'pagarme',
        externalId: 'ext-123',
        method: PaymentMethod.PIX,
        status: PaymentStatus.PENDING,
        amount: 5000,
      }),
    );
    expect(mockEventsPublisher.publishPaymentInitiated).toHaveBeenCalledWith({
      paymentId: 1,
      orderId: 100,
      method: PaymentMethod.PIX,
      amount: 5000,
    });
  });

  it('should throw ConflictException when payment already exists for order', async () => {
    mockRepository.findByOrderId.mockResolvedValue(mockPaymentEntity);

    await expect(useCase.execute(validInput)).rejects.toThrow(ConflictException);
    expect(mockRepository.findByOrderId).toHaveBeenCalledWith(100);
    expect(mockGatewayRegistry.get).not.toHaveBeenCalled();
  });

  it('should default to pagarme provider when no provider specified', async () => {
    mockRepository.findByOrderId.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(mockPaymentEntity);
    const inputWithoutProvider = { ...validInput, provider: undefined };

    await useCase.execute(inputWithoutProvider);

    expect(mockGatewayRegistry.get).toHaveBeenCalledWith('pagarme');
  });

  it('should use pagbank provider when specified', async () => {
    mockRepository.findByOrderId.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(mockPaymentEntity);
    const inputWithPagbank = { ...validInput, provider: 'pagbank' };

    await useCase.execute(inputWithPagbank);

    expect(mockGatewayRegistry.get).toHaveBeenCalledWith('pagbank');
  });

  it('should handle boleto payment method', async () => {
    const boletoPayment = new PaymentEntity(
      2, 101, 'pagarme', 'ext-456', PaymentMethod.BOLETO, PaymentStatus.PENDING,
      7500, null, null, null, 'https://boleto.example.com', '23793.38128 60000.000003 00000.000400 1 84340000007500',
      now, null, null, null, now, now,
    );

    mockRepository.findByOrderId.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(boletoPayment);

    const mockGateway = {
      createCharge: jest.fn().mockResolvedValue({
        externalId: 'ext-456',
        boletoUrl: 'https://boleto.example.com',
        boletoBarcode: '23793.38128 60000.000003 00000.000400 1 84340000007500',
        boletoExpiresAt: now,
      }),
    };
    mockGatewayRegistry.get = jest.fn().mockReturnValue(mockGateway);

    const boletoInput = { ...validInput, method: PaymentMethod.BOLETO, orderId: 101 };
    const result = await useCase.execute(boletoInput);

    expect(result.boletoUrl).toBe('https://boleto.example.com');
    expect(result.boletoBarcode).toBe('23793.38128 60000.000003 00000.000400 1 84340000007500');
    expect(result.boletoExpiresAt).toBe(now.toISOString());
  });

  it('should handle credit card payment method with checkout URL', async () => {
    const ccPayment = new PaymentEntity(
      3, 102, 'pagarme', 'ext-789', PaymentMethod.CREDIT_CARD, PaymentStatus.PENDING,
      10000, null, null, null, null, null, null, 'https://checkout.example.com',
      null, null, now, now,
    );

    mockRepository.findByOrderId.mockResolvedValue(null);
    mockRepository.create.mockResolvedValue(ccPayment);

    const mockGateway = {
      createCharge: jest.fn().mockResolvedValue({
        externalId: 'ext-789',
        checkoutUrl: 'https://checkout.example.com',
      }),
    };
    mockGatewayRegistry.get = jest.fn().mockReturnValue(mockGateway);

    const ccInput = { ...validInput, method: PaymentMethod.CREDIT_CARD, orderId: 102 };
    const result = await useCase.execute(ccInput);

    expect(result.checkoutUrl).toBe('https://checkout.example.com');
    expect(result.pixQrCode).toBeUndefined();
    expect(result.boletoUrl).toBeUndefined();
  });
});
