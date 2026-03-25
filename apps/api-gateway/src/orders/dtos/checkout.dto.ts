export interface CheckoutItemDto {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutDto {
  items: CheckoutItemDto[];
  shippingFee?: number;
  discount?: number;
  addressSnapshot?: string;
}
