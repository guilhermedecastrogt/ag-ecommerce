export interface PaymentResponseDto {
  id: number;
  orderId: number;
  method: string;
  status: string;
  // PIX
  pixQrCode?: string;
  pixQrCodeUrl?: string;
  pixExpiresAt?: string;
  // Boleto
  boletoUrl?: string;
  boletoBarcode?: string;
  boletoExpiresAt?: string;
  // Cartão de crédito (redirect)
  checkoutUrl?: string;
}
