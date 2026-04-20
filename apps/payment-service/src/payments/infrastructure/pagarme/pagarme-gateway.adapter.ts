import { Injectable } from '@nestjs/common';
import type {
  CreateChargeInput,
  CreateChargeResult,
  PaymentGatewayPort,
} from '../../application/ports/payment-gateway.port';
import { PaymentMethod } from '../../domain/entities/payment-method.enum';
import { PagarmeClient } from './pagarme-client';

@Injectable()
export class PagarmeGatewayAdapter implements PaymentGatewayPort {
  constructor(private readonly pagarmeClient: PagarmeClient) {}

  async createCharge(input: CreateChargeInput): Promise<CreateChargeResult> {
    const items = input.items.map((item) => ({
      code: item.productId,
      amount: item.amount,
      description: item.name,
      quantity: item.quantity,
    }));

    const customer = this.buildCustomer(input.customer);
    const payments = this.buildPayments(input);

    const order = await this.pagarmeClient.createOrder({
      code: `order-${input.orderId}`,
      customer,
      items,
      payments,
    });

    return this.parseResponse(input.method, order);
  }

  private buildCustomer(customer: CreateChargeInput['customer']): {
    name: string;
    email: string;
    type: string;
    document?: string;
    document_type?: string;
    phones?: {
      mobile_phone?: { country_code: string; area_code: string; number: string };
    };
  } {
    const result: {
      name: string;
      email: string;
      type: string;
      document?: string;
      document_type?: string;
      phones?: {
        mobile_phone?: { country_code: string; area_code: string; number: string };
      };
    } = {
      name: customer.name,
      email: customer.email,
      type: 'individual',
    };

    if (customer.document) {
      result.document = customer.document;
      result.document_type = 'CPF';
    }

    if (customer.phone) {
      const phone = customer.phone.replace(/\D/g, '');
      result.phones = {
        mobile_phone: {
          country_code: '55',
          area_code: phone.slice(0, 2),
          number: phone.slice(2),
        },
      };
    }

    return result;
  }

  private buildPayments(input: CreateChargeInput): unknown[] {
    if (input.method === PaymentMethod.PIX) {
      return [
        {
          payment_method: 'pix',
          pix: { expires_in: 3600 },
        },
      ];
    }

    if (input.method === PaymentMethod.BOLETO) {
      const dueAt = new Date();
      dueAt.setDate(dueAt.getDate() + 3);
      return [
        {
          payment_method: 'boleto',
          boleto: {
            instructions: `Pagamento referente ao pedido #${input.orderId}`,
            due_at: dueAt.toISOString(),
          },
        },
      ];
    }

    // CREDIT_CARD — checkout link (redirect para página do Pagar.me)
    return [
      {
        payment_method: 'checkout',
        checkout: {
          expires_in: 3600,
          billing_address_editable: false,
          customer_editable: false,
          accepted_payment_methods: ['credit_card'],
          success_url: input.successUrl ?? process.env.PAGARME_SUCCESS_URL,
          cancel_url: input.cancelUrl ?? process.env.PAGARME_CANCEL_URL,
          credit_card: {
            capture: true,
            installments: [{ number: 1, total: input.amount }],
          },
        },
      },
    ];
  }

  private parseResponse(
    method: PaymentMethod,
    order: Awaited<ReturnType<PagarmeClient['createOrder']>>,
  ): CreateChargeResult {
    const orderId = order.id;

    if (method === PaymentMethod.CREDIT_CARD) {
      const checkout = order.checkouts?.[0];
      return {
        externalId: orderId,
        checkoutUrl: checkout?.payment_url,
      };
    }

    const charge = order.charges?.[0];
    const tx = charge?.last_transaction;

    if (method === PaymentMethod.PIX) {
      return {
        externalId: orderId,
        pixQrCode: tx?.qr_code,
        pixQrCodeUrl: tx?.qr_code_url,
        pixExpiresAt: tx?.expires_at ? new Date(tx.expires_at) : undefined,
      };
    }

    // BOLETO
    return {
      externalId: orderId,
      boletoUrl: tx?.url ?? tx?.pdf?.url,
      boletoBarcode: tx?.line,
      boletoExpiresAt: tx?.due_at ? new Date(tx.due_at) : undefined,
    };
  }
}
