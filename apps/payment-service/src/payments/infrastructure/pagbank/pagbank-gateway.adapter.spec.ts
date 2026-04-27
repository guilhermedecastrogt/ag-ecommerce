import { BadRequestException } from '@nestjs/common';
import { PagBankGatewayAdapter } from './pagbank-gateway.adapter';
import { PagBankClient } from './pagbank-client';
import { PaymentMethod } from '../../domain/entities/payment-method.enum';
import type { CreateChargeInput } from '../../application/ports/payment-gateway.port';

describe('PagBankGatewayAdapter', () => {
  let adapter: PagBankGatewayAdapter;
  let mockClient: jest.Mocked<PagBankClient>;

  const baseInput: CreateChargeInput = {
    orderId: 200,
    amount: 10000,
    method: PaymentMethod.PIX,
    customer: {
      name: 'Maria Silva',
      email: 'maria@example.com',
      document: '98765432100',
      phone: '21988887777',
    },
    items: [
      { productId: 'p2', name: 'Product 2', amount: 10000, quantity: 1 },
    ],
  };

  beforeEach(() => {
    mockClient = {
      createOrder: jest.fn(),
      createCheckout: jest.fn(),
    } as any;

    adapter = new PagBankGatewayAdapter(mockClient);
  });

  describe('PIX payments', () => {
    it('should create a PIX charge and return QR code data', async () => {
      const expirationDate = new Date(Date.now() + 3600 * 1000).toISOString();
      mockClient.createOrder.mockResolvedValue({
        id: 'ORDE_pagbank-pix-123',
        reference_id: 'order-200',
        qr_codes: [{
          id: 'QRCO_1',
          text: 'pix-payload-pagbank',
          expiration_date: expirationDate,
          links: [
            { rel: 'QRCODE.PNG', href: 'https://api.pagseguro.com/qr.png' },
          ],
        }],
      });

      const result = await adapter.createCharge({
        ...baseInput,
        method: PaymentMethod.PIX,
      });

      expect(result.externalId).toBe('ORDE_pagbank-pix-123');
      expect(result.pixQrCode).toBe('pix-payload-pagbank');
      expect(result.pixQrCodeUrl).toBe('https://api.pagseguro.com/qr.png');
      expect(result.pixExpiresAt).toBeInstanceOf(Date);

      expect(mockClient.createOrder).toHaveBeenCalledWith(expect.objectContaining({
        reference_id: 'order-200',
        qr_codes: expect.arrayContaining([
          expect.objectContaining({ amount: { value: 10000 } }),
        ]),
      }));
      expect(mockClient.createCheckout).not.toHaveBeenCalled();
    });
  });

  describe('Boleto payments', () => {
    const boletoInput: CreateChargeInput = {
      ...baseInput,
      method: PaymentMethod.BOLETO,
      customer: {
        ...baseInput.customer,
        address: {
          street: 'Rua Teste',
          number: '123',
          locality: 'Centro',
          city: 'São Paulo',
          region: 'São Paulo',
          region_code: 'SP',
          country: 'BRA',
          postal_code: '01310100',
        },
      },
    };

    it('should create a boleto charge and return barcode + URL', async () => {
      mockClient.createOrder.mockResolvedValue({
        id: 'ORDE_pagbank-boleto-456',
        reference_id: 'order-200',
        charges: [{
          id: 'CHAR_1',
          status: 'WAITING',
          payment_method: {
            type: 'BOLETO',
            boleto: {
              id: 'bol-1',
              barcode: '12345678901234567890',
              formatted_barcode: '12345.67890 12345.678901 12345.678901 1 84340000010000',
              due_date: '2025-12-31',
            },
          },
          links: [
            { rel: 'SELF', href: 'https://boleto.sandbox.pagseguro.com.br/abc.pdf', media: 'application/pdf' },
            { rel: 'SELF', href: 'https://boleto.sandbox.pagseguro.com.br/abc.png', media: 'image/png' },
          ],
        }],
      });

      const result = await adapter.createCharge(boletoInput);

      expect(result.externalId).toBe('ORDE_pagbank-boleto-456');
      expect(result.boletoBarcode).toBe('12345678901234567890');
      expect(result.boletoUrl).toBe('https://boleto.sandbox.pagseguro.com.br/abc.pdf');
      expect(result.boletoExpiresAt).toBeInstanceOf(Date);

      expect(mockClient.createOrder).toHaveBeenCalledWith(expect.objectContaining({
        reference_id: 'order-200',
        charges: expect.arrayContaining([
          expect.objectContaining({
            payment_method: expect.objectContaining({ type: 'BOLETO' }),
          }),
        ]),
      }));
    });

    it('should throw BadRequestException when address is missing for boleto', async () => {
      const inputNoAddress = { ...baseInput, method: PaymentMethod.BOLETO };
      await expect(adapter.createCharge(inputNoAddress)).rejects.toThrow(BadRequestException);
      expect(mockClient.createOrder).not.toHaveBeenCalled();
    });
  });

  describe('Credit card (checkout) payments', () => {
    it('should create a checkout and return payment URL', async () => {
      mockClient.createCheckout.mockResolvedValue({
        id: 'CHEC_pb-789',
        reference_id: 'order-200',
        links: [
          { rel: 'PAY', href: 'https://sandbox.pagseguro.uol.com.br/checkout/abc' },
        ],
      });

      const result = await adapter.createCharge({
        ...baseInput,
        method: PaymentMethod.CREDIT_CARD,
        successUrl: 'https://success.example.com',
      });

      expect(result.externalId).toBe('CHEC_pb-789');
      expect(result.checkoutUrl).toBe('https://sandbox.pagseguro.uol.com.br/checkout/abc');

      expect(mockClient.createCheckout).toHaveBeenCalled();
      expect(mockClient.createOrder).not.toHaveBeenCalled();
    });

    it('should include customer tax_id when document is provided', async () => {
      mockClient.createCheckout.mockResolvedValue({
        id: 'CHEC_pb-999',
        reference_id: 'order-200',
        links: [{ rel: 'PAY', href: 'https://pay.example.com' }],
      });

      await adapter.createCharge({
        ...baseInput,
        method: PaymentMethod.CREDIT_CARD,
      });

      expect(mockClient.createCheckout).toHaveBeenCalledWith(
        expect.objectContaining({
          customer: expect.objectContaining({
            tax_id: '98765432100',
          }),
        }),
      );
    });
  });
});
