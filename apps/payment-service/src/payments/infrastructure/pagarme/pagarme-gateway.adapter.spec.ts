import { PagarmeGatewayAdapter } from './pagarme-gateway.adapter';
import { PagarmeClient } from './pagarme-client';
import { PaymentMethod } from '../../domain/entities/payment-method.enum';
import type { CreateChargeInput } from '../../application/ports/payment-gateway.port';

describe('PagarmeGatewayAdapter', () => {
  let adapter: PagarmeGatewayAdapter;
  let mockClient: jest.Mocked<PagarmeClient>;

  const baseInput: CreateChargeInput = {
    orderId: 100,
    amount: 5000,
    method: PaymentMethod.PIX,
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
    mockClient = {
      createOrder: jest.fn(),
    } as any;

    adapter = new PagarmeGatewayAdapter(mockClient);
  });

  describe('PIX payments', () => {
    it('should create a PIX charge and return QR code data', async () => {
      const expiresAt = new Date();
      mockClient.createOrder.mockResolvedValue({
        id: 'order-id-123',
        code: 'order-100',
        status: 'pending',
        charges: [{
          id: 'charge-1',
          status: 'pending',
          last_transaction: {
            qr_code: 'pix-payload-text',
            qr_code_url: 'https://api.pagar.me/qr.png',
            expires_at: expiresAt.toISOString(),
          },
        }],
      });

      const result = await adapter.createCharge({
        ...baseInput,
        method: PaymentMethod.PIX,
      });

      expect(result.externalId).toBe('order-id-123');
      expect(result.pixQrCode).toBe('pix-payload-text');
      expect(result.pixQrCodeUrl).toBe('https://api.pagar.me/qr.png');
      expect(result.pixExpiresAt).toBeInstanceOf(Date);

      expect(mockClient.createOrder).toHaveBeenCalledWith(expect.objectContaining({
        code: 'order-100',
        payments: expect.arrayContaining([
          expect.objectContaining({ payment_method: 'pix' }),
        ]),
      }));
    });
  });

  describe('Boleto payments', () => {
    it('should create a boleto charge and return URL + barcode', async () => {
      const dueAt = new Date();
      dueAt.setDate(dueAt.getDate() + 3);

      mockClient.createOrder.mockResolvedValue({
        id: 'order-id-456',
        code: 'order-100',
        status: 'pending',
        charges: [{
          id: 'charge-2',
          status: 'pending',
          last_transaction: {
            url: 'https://boleto.example.com',
            line: '23793.38128 60000.000003',
            due_at: dueAt.toISOString(),
          },
        }],
      });

      const result = await adapter.createCharge({
        ...baseInput,
        method: PaymentMethod.BOLETO,
      });

      expect(result.externalId).toBe('order-id-456');
      expect(result.boletoUrl).toBe('https://boleto.example.com');
      expect(result.boletoBarcode).toBe('23793.38128 60000.000003');
      expect(result.boletoExpiresAt).toBeInstanceOf(Date);

      expect(mockClient.createOrder).toHaveBeenCalledWith(expect.objectContaining({
        payments: expect.arrayContaining([
          expect.objectContaining({ payment_method: 'boleto' }),
        ]),
      }));
    });
  });

  describe('Credit card (checkout) payments', () => {
    it('should create a checkout and return checkout URL', async () => {
      mockClient.createOrder.mockResolvedValue({
        id: 'order-id-789',
        code: 'order-100',
        status: 'pending',
        checkouts: [{
          id: 'checkout-1',
          payment_url: 'https://checkout.pagar.me/pay/abc',
          status: 'open',
        }],
      });

      const result = await adapter.createCharge({
        ...baseInput,
        method: PaymentMethod.CREDIT_CARD,
        successUrl: 'https://success.example.com',
        cancelUrl: 'https://cancel.example.com',
      });

      expect(result.externalId).toBe('order-id-789');
      expect(result.checkoutUrl).toBe('https://checkout.pagar.me/pay/abc');

      expect(mockClient.createOrder).toHaveBeenCalledWith(expect.objectContaining({
        payments: expect.arrayContaining([
          expect.objectContaining({ payment_method: 'checkout' }),
        ]),
      }));
    });
  });

  describe('Customer building', () => {
    it('should include document and phone when provided', async () => {
      mockClient.createOrder.mockResolvedValue({
        id: 'id-1', code: 'order-100', status: 'pending', charges: [{
          id: 'c', status: 'pending', last_transaction: { qr_code: 'x', qr_code_url: 'y' },
        }],
      });

      await adapter.createCharge(baseInput);

      expect(mockClient.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: expect.objectContaining({
            name: 'John Doe',
            email: 'john@example.com',
            document: '12345678900',
            document_type: 'CPF',
            type: 'individual',
            phones: expect.objectContaining({
              mobile_phone: expect.objectContaining({
                country_code: '55',
              }),
            }),
          }),
        }),
      );
    });

    it('should not include document when not provided', async () => {
      mockClient.createOrder.mockResolvedValue({
        id: 'id-1', code: 'order-100', status: 'pending', charges: [{
          id: 'c', status: 'pending', last_transaction: { qr_code: 'x', qr_code_url: 'y' },
        }],
      });

      const inputNoDoc = {
        ...baseInput,
        customer: { name: 'Jane', email: 'jane@example.com' },
      };

      await adapter.createCharge(inputNoDoc);

      const call = mockClient.createOrder.mock.calls[0][0];
      expect(call.customer.document).toBeUndefined();
      expect(call.customer.document_type).toBeUndefined();
      expect(call.customer.phones).toBeUndefined();
    });
  });
});
