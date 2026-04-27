import { BadRequestException } from '@nestjs/common';
import { PaymentGatewayRegistry } from './payment-gateway.registry';
import { PagarmeGatewayAdapter } from '../../infrastructure/pagarme/pagarme-gateway.adapter';
import { PagBankGatewayAdapter } from '../../infrastructure/pagbank/pagbank-gateway.adapter';

describe('PaymentGatewayRegistry', () => {
  let registry: PaymentGatewayRegistry;
  let mockPagarme: jest.Mocked<PagarmeGatewayAdapter>;
  let mockPagBank: jest.Mocked<PagBankGatewayAdapter>;

  beforeEach(() => {
    mockPagarme = {
      createCharge: jest.fn(),
    } as any;

    mockPagBank = {
      createCharge: jest.fn(),
    } as any;

    registry = new PaymentGatewayRegistry(mockPagarme, mockPagBank);
  });

  it('should return the pagarme gateway', () => {
    const gateway = registry.get('pagarme');
    expect(gateway).toBe(mockPagarme);
  });

  it('should return the pagbank gateway', () => {
    const gateway = registry.get('pagbank');
    expect(gateway).toBe(mockPagBank);
  });

  it('should throw BadRequestException for unknown provider', () => {
    expect(() => registry.get('stripe')).toThrow(BadRequestException);
    expect(() => registry.get('stripe')).toThrow('Unknown payment provider: stripe');
  });

  it('should throw BadRequestException for empty provider', () => {
    expect(() => registry.get('')).toThrow(BadRequestException);
  });
});
