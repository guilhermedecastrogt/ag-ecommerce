import { Injectable } from '@nestjs/common';
import { PaymentPrismaService } from '../../../payment-prisma.service';
import type {
  CreatePaymentData,
  PaymentsRepository,
  UpdatePaymentData,
} from '../../domain/repositories/payments.repository';
import { PaymentEntity } from '../../domain/entities/payment.entity';
import { PaymentMethod } from '../../domain/entities/payment-method.enum';
import { PaymentStatus } from '../../domain/entities/payment-status.enum';

@Injectable()
export class PrismaPaymentsRepository implements PaymentsRepository {
  constructor(private readonly prisma: PaymentPrismaService) {}

  async findByOrderId(orderId: number): Promise<PaymentEntity | null> {
    const row = await this.prisma.payment.findUnique({ where: { orderId } });
    return row ? this.toEntity(row) : null;
  }

  async findByExternalId(externalId: string): Promise<PaymentEntity | null> {
    const row = await this.prisma.payment.findFirst({
      where: { externalId },
    });
    return row ? this.toEntity(row) : null;
  }

  async create(data: CreatePaymentData): Promise<PaymentEntity> {
    const row = await this.prisma.payment.create({
      data: {
        orderId: data.orderId,
        provider: data.provider,
        externalId: data.externalId,
        method: data.method,
        status: data.status,
        amount: data.amount,
        pixQrCode: data.pixQrCode ?? null,
        pixQrCodeUrl: data.pixQrCodeUrl ?? null,
        pixExpiresAt: data.pixExpiresAt ?? null,
        boletoUrl: data.boletoUrl ?? null,
        boletoBarcode: data.boletoBarcode ?? null,
        boletoExpiresAt: data.boletoExpiresAt ?? null,
        checkoutUrl: data.checkoutUrl ?? null,
      },
    });
    return this.toEntity(row);
  }

  async update(id: number, data: UpdatePaymentData): Promise<PaymentEntity> {
    const row = await this.prisma.payment.update({
      where: { id },
      data: {
        ...(data.status !== undefined && { status: data.status }),
        ...(data.externalId !== undefined && { externalId: data.externalId }),
        ...(data.lastWebhookAt !== undefined && {
          lastWebhookAt: data.lastWebhookAt,
        }),
        ...(data.webhookPayload !== undefined && {
          webhookPayload: data.webhookPayload,
        }),
      },
    });
    return this.toEntity(row);
  }

  private toEntity(row: {
    id: number;
    orderId: number;
    provider: string;
    externalId: string | null;
    method: string;
    status: string;
    amount: number;
    pixQrCode: string | null;
    pixQrCodeUrl: string | null;
    pixExpiresAt: Date | null;
    boletoUrl: string | null;
    boletoBarcode: string | null;
    boletoExpiresAt: Date | null;
    checkoutUrl: string | null;
    lastWebhookAt: Date | null;
    webhookPayload: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): PaymentEntity {
    return new PaymentEntity(
      row.id,
      row.orderId,
      row.provider,
      row.externalId,
      row.method as PaymentMethod,
      row.status as PaymentStatus,
      row.amount,
      row.pixQrCode,
      row.pixQrCodeUrl,
      row.pixExpiresAt,
      row.boletoUrl,
      row.boletoBarcode,
      row.boletoExpiresAt,
      row.checkoutUrl,
      row.lastWebhookAt,
      row.webhookPayload,
      row.createdAt,
      row.updatedAt,
    );
  }
}
