import { Injectable, BadRequestException } from '@nestjs/common';
import type {
  CreateChargeInput,
  CreateChargeResult,
  PaymentGatewayPort,
} from '../../application/ports/payment-gateway.port';
import { PaymentMethod } from '../../domain/entities/payment-method.enum';
import { PagBankClient } from './pagbank-client';

@Injectable()
export class PagBankGatewayAdapter implements PaymentGatewayPort {
  constructor(private readonly pagBankClient: PagBankClient) {}

  async createCharge(input: CreateChargeInput): Promise<CreateChargeResult> {
    if (input.method === PaymentMethod.CREDIT_CARD) {
      return this.createCreditCardCheckout(input);
    }
    return this.createDirectCharge(input);
  }

  private async createDirectCharge(input: CreateChargeInput): Promise<CreateChargeResult> {
    const notificationUrl = process.env.PAGBANK_WEBHOOK_URL;

    if (input.method === PaymentMethod.PIX) {
      const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();
      const order = await this.pagBankClient.createOrder({
        reference_id: `order-${input.orderId}`,
        customer: {
          name: input.customer.name,
          email: input.customer.email,
          ...(input.customer.document && { tax_id: input.customer.document }),
        },
        items: input.items.map((item) => ({
          reference_id: item.productId,
          name: item.name,
          quantity: item.quantity,
          unit_amount: item.amount,
        })),
        qr_codes: [{ amount: { value: input.amount }, expiration_date: expiresAt }],
        ...(notificationUrl && { notification_urls: [notificationUrl] }),
      });

      const qr = order.qr_codes?.[0];
      const pngLink = qr?.links?.find((l) => l.rel === 'QRCODE.PNG');
      return {
        externalId: order.id,
        pixQrCode: qr?.text,
        pixQrCodeUrl: pngLink?.href,
        pixExpiresAt: qr?.expiration_date ? new Date(qr.expiration_date) : undefined,
      };
    }

    // BOLETO
    if (!input.customer.address) {
      throw new BadRequestException(
        'Customer address is required for boleto payments with PagBank',
      );
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    const order = await this.pagBankClient.createOrder({
      reference_id: `order-${input.orderId}`,
      customer: {
        name: input.customer.name,
        email: input.customer.email,
        ...(input.customer.document && { tax_id: input.customer.document }),
      },
      items: input.items.map((item) => ({
        reference_id: item.productId,
        name: item.name,
        quantity: item.quantity,
        unit_amount: item.amount,
      })),
      charges: [{
        reference_id: `charge-boleto-${input.orderId}`,
        description: `Pedido #${input.orderId}`,
        amount: { value: input.amount, currency: 'BRL' },
        payment_method: {
          type: 'BOLETO',
          boleto: {
            due_date: dueDate.toISOString().slice(0, 10),
            instruction_lines: {
              line_1: `Pedido #${input.orderId}`,
              line_2: 'Vencimento em 3 dias úteis',
            },
            holder: {
              name: input.customer.name,
              email: input.customer.email,
              ...(input.customer.document && { tax_id: input.customer.document }),
              address: input.customer.address,
            },
          },
        },
      }],
      ...(notificationUrl && { notification_urls: [notificationUrl] }),
    });

    const charge = order.charges?.[0];
    const boleto = charge?.payment_method?.boleto;
    // PDF link tem rel: "SELF" e href terminando em .pdf
    const pdfLink = charge?.links?.find((l) => l.href?.endsWith('.pdf'));
    return {
      externalId: order.id,
      boletoUrl: pdfLink?.href,
      boletoBarcode: boleto?.barcode,
      boletoExpiresAt: boleto?.due_date ? new Date(boleto.due_date) : undefined,
    };
  }

  private async createCreditCardCheckout(input: CreateChargeInput): Promise<CreateChargeResult> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const successUrl = input.successUrl ?? process.env.PAGBANK_SUCCESS_URL;
    const notificationUrl = process.env.PAGBANK_WEBHOOK_URL;

    const checkout = await this.pagBankClient.createCheckout({
      reference_id: `order-${input.orderId}`,
      expiration_date: expiresAt.toISOString(),
      customer: {
        name: input.customer.name,
        email: input.customer.email,
        ...(input.customer.document && { tax_id: input.customer.document }),
      },
      items: input.items.map((item) => ({
        reference_id: item.productId,
        name: item.name,
        quantity: item.quantity,
        unit_amount: item.amount,
      })),
      payment_methods: [{ type: 'CREDIT_CARD' }],
      ...(successUrl && { redirect_url: successUrl, return_url: successUrl }),
      ...(notificationUrl && { notification_urls: [notificationUrl] }),
    });

    const payLink = checkout.links?.find((l) => l.rel === 'PAY');
    return {
      externalId: checkout.id,
      checkoutUrl: payLink?.href,
    };
  }
}
