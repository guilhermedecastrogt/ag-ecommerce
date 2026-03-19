export type CartItem = {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
};

export type Cart = {
  items: CartItem[];
};
