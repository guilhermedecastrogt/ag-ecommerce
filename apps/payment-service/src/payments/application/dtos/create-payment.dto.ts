import { PaymentMethod } from '../../domain/entities/payment-method.enum';

export interface CreatePaymentInput {
  orderId: number;
  amount: number; // em centavos
  method: PaymentMethod;
  provider?: string; // 'pagarme' | 'pagbank' — padrão: 'pagarme'
  customer: {
    name: string;
    email: string;
    document?: string;
    phone?: string;
    address?: {
      street: string;
      number: string;
      locality: string;
      city: string;
      region: string;
      region_code: string;
      country: string;
      postal_code: string;
    };
  };
  items: Array<{
    productId: string;
    name: string;
    amount: number; // em centavos
    quantity: number;
  }>;
}
