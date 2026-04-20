export interface CheckoutItemDto {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutCustomerDto {
  name: string;
  email: string;
  document?: string; // CPF (opcional)
  phone?: string;
}

export type CheckoutPaymentMethod = 'pix' | 'boleto' | 'credit_card';

export type CheckoutProvider = 'pagarme' | 'pagbank';

export interface CheckoutDto {
  items: CheckoutItemDto[];
  shippingFee?: number;
  discount?: number;
  addressSnapshot?: string;
  paymentMethod: CheckoutPaymentMethod;
  provider?: CheckoutProvider; // padrão: 'pagarme'
  customer: CheckoutCustomerDto;
}
