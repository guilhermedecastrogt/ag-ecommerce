import { PaymentEntity } from './payment.entity';
import { PaymentMethod } from './payment-method.enum';
import { PaymentStatus } from './payment-status.enum';

describe('PaymentEntity', () => {
  const now = new Date();

  function buildPayment(overrides: Partial<ConstructorParameters<typeof PaymentEntity>> = {}): PaymentEntity {
    const defaults: ConstructorParameters<typeof PaymentEntity> = [
      1,                          // id
      100,                        // orderId
      'pagarme',                  // provider
      'ext-123',                  // externalId
      PaymentMethod.PIX,          // method
      PaymentStatus.PENDING,      // status
      5000,                       // amount (centavos)
      'pix-qr-code-text',         // pixQrCode
      'https://qr.example.com',   // pixQrCodeUrl
      now,                        // pixExpiresAt
      null,                       // boletoUrl
      null,                       // boletoBarcode
      null,                       // boletoExpiresAt
      null,                       // checkoutUrl
      null,                       // lastWebhookAt
      null,                       // webhookPayload
      now,                        // createdAt
      now,                        // updatedAt
    ];
    const args = [...defaults] as ConstructorParameters<typeof PaymentEntity>;
    // Apply overrides by index mapping
    if (overrides[5] !== undefined) args[5] = overrides[5];
    return new PaymentEntity(...args);
  }

  it('should store all constructor properties', () => {
    const payment = buildPayment();
    expect(payment.id).toBe(1);
    expect(payment.orderId).toBe(100);
    expect(payment.provider).toBe('pagarme');
    expect(payment.externalId).toBe('ext-123');
    expect(payment.method).toBe(PaymentMethod.PIX);
    expect(payment.status).toBe(PaymentStatus.PENDING);
    expect(payment.amount).toBe(5000);
    expect(payment.pixQrCode).toBe('pix-qr-code-text');
    expect(payment.pixQrCodeUrl).toBe('https://qr.example.com');
    expect(payment.pixExpiresAt).toBe(now);
    expect(payment.boletoUrl).toBeNull();
    expect(payment.boletoBarcode).toBeNull();
    expect(payment.boletoExpiresAt).toBeNull();
    expect(payment.checkoutUrl).toBeNull();
    expect(payment.lastWebhookAt).toBeNull();
    expect(payment.webhookPayload).toBeNull();
    expect(payment.createdAt).toBe(now);
    expect(payment.updatedAt).toBe(now);
  });

  describe('isPending', () => {
    it('returns true when status is PENDING', () => {
      const payment = new PaymentEntity(
        1, 100, 'pagarme', null, PaymentMethod.PIX, PaymentStatus.PENDING,
        5000, null, null, null, null, null, null, null, null, null, now, now,
      );
      expect(payment.isPending).toBe(true);
    });

    it('returns false when status is PAID', () => {
      const payment = new PaymentEntity(
        1, 100, 'pagarme', null, PaymentMethod.PIX, PaymentStatus.PAID,
        5000, null, null, null, null, null, null, null, null, null, now, now,
      );
      expect(payment.isPending).toBe(false);
    });

    it('returns false when status is FAILED', () => {
      const payment = new PaymentEntity(
        1, 100, 'pagarme', null, PaymentMethod.PIX, PaymentStatus.FAILED,
        5000, null, null, null, null, null, null, null, null, null, now, now,
      );
      expect(payment.isPending).toBe(false);
    });

    it('returns false when status is REFUNDED', () => {
      const payment = new PaymentEntity(
        1, 100, 'pagarme', null, PaymentMethod.PIX, PaymentStatus.REFUNDED,
        5000, null, null, null, null, null, null, null, null, null, now, now,
      );
      expect(payment.isPending).toBe(false);
    });
  });

  describe('isPaid', () => {
    it('returns true when status is PAID', () => {
      const payment = new PaymentEntity(
        1, 100, 'pagarme', null, PaymentMethod.PIX, PaymentStatus.PAID,
        5000, null, null, null, null, null, null, null, null, null, now, now,
      );
      expect(payment.isPaid).toBe(true);
    });

    it('returns false when status is PENDING', () => {
      const payment = new PaymentEntity(
        1, 100, 'pagarme', null, PaymentMethod.PIX, PaymentStatus.PENDING,
        5000, null, null, null, null, null, null, null, null, null, now, now,
      );
      expect(payment.isPaid).toBe(false);
    });
  });
});
