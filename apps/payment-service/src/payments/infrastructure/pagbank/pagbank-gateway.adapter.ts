import { Injectable } from '@nestjs/common';
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
    const charge = await this.pagBankClient.createCharge({
      reference_id: `order-${input.orderId}`,
      description: `Pedido #${input.orderId}`,
      amount: { value: input.amount, currency: 'BRL' },
      payment_method: this.buildPaymentMethod(input),
      ...(notificationUrl && { notification_urls: [notificationUrl] }),
    });

    if (input.method === PaymentMethod.PIX) {
      const qr = charge.qr_codes?.[0];
      const pngLink = qr?.links?.find((l) => l.rel === 'QRCODE.PNG');
      return {
        externalId: charge.id,
        pixQrCode: qr?.text,
        pixQrCodeUrl: pngLink?.href,
        pixExpiresAt: qr?.expiration_date ? new Date(qr.expiration_date) : undefined,
      };
    }

    // Boleto
    const boleto = charge.payment_method?.boleto;
    const boletoLink = boleto?.links?.find((l) => l.rel === 'BOLETO.PDF');
    return {
      externalId: charge.id,
      boletoUrl: boletoLink?.href,
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

  private buildPaymentMethod(input: CreateChargeInput): unknown {
    if (input.method === PaymentMethod.PIX) {
      return { type: 'PIX', installments: 1, capture: true };
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 3);

    return {
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
        },
      },
    };
  }
}
