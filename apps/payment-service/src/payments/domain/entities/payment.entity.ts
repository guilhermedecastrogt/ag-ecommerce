import { PaymentMethod } from './payment-method.enum';
import { PaymentStatus } from './payment-status.enum';

export class PaymentEntity {
  constructor(
    public readonly id: number,
    public readonly orderId: number,
    public readonly provider: string,
    public readonly externalId: string | null,
    public readonly method: PaymentMethod,
    public readonly status: PaymentStatus,
    public readonly amount: number,
    public readonly pixQrCode: string | null,
    public readonly pixQrCodeUrl: string | null,
    public readonly pixExpiresAt: Date | null,
    public readonly boletoUrl: string | null,
    public readonly boletoBarcode: string | null,
    public readonly boletoExpiresAt: Date | null,
    public readonly checkoutUrl: string | null,
    public readonly lastWebhookAt: Date | null,
    public readonly webhookPayload: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get isPending(): boolean {
    return this.status === PaymentStatus.PENDING;
  }

  get isPaid(): boolean {
    return this.status === PaymentStatus.PAID;
  }
}
