import { PaymentMethod } from '../../domain/entities/payment-method.enum';

export interface CreateChargeInput {
  orderId: number;
  amount: number; // em centavos
  method: PaymentMethod;
  customer: {
    name: string;
    email: string;
    document?: string; // CPF
    phone?: string;
  };
  items: Array<{
    productId: string;
    name: string;
    amount: number; // em centavos
    quantity: number;
  }>;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateChargeResult {
  externalId: string;
  pixQrCode?: string;
  pixQrCodeUrl?: string;
  pixExpiresAt?: Date;
  boletoUrl?: string;
  boletoBarcode?: string;
  boletoExpiresAt?: Date;
  checkoutUrl?: string;
}

export interface PaymentGatewayPort {
  createCharge(input: CreateChargeInput): Promise<CreateChargeResult>;
}
