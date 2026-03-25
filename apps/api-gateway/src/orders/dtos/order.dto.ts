export interface OrderItemDto {
  id: number;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderDto {
  id: number;
  userId: number;
  status: string;
  subTotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  items: OrderItemDto[];
  addressSnapshot: string | null;
  createdAt: Date;
  updatedAt: Date;
}
