import { PaymentEntity } from '../entities/payment.entity';
import { PaymentStatus } from '../entities/payment-status.enum';

export interface CreatePaymentData {
  orderId: number;
  provider: string;
  externalId: string | null;
  method: string;
  status: PaymentStatus;
  amount: number;
  pixQrCode?: string | null;
  pixQrCodeUrl?: string | null;
  pixExpiresAt?: Date | null;
  boletoUrl?: string | null;
  boletoBarcode?: string | null;
  boletoExpiresAt?: Date | null;
  checkoutUrl?: string | null;
}

export interface UpdatePaymentData {
  status?: PaymentStatus;
  externalId?: string;
  lastWebhookAt?: Date;
  webhookPayload?: string;
}

export interface PaymentsRepository {
  findByOrderId(orderId: number): Promise<PaymentEntity | null>;
  findByExternalId(externalId: string): Promise<PaymentEntity | null>;
  create(data: CreatePaymentData): Promise<PaymentEntity>;
  update(id: number, data: UpdatePaymentData): Promise<PaymentEntity>;
}
