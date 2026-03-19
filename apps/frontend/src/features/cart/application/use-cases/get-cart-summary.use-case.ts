import { Cart } from "../../domain/cart";

export type CartSummary = {
  quantity: number;
  subtotal: number;
};

export function getCartSummaryUseCase(cart: Cart): CartSummary {
  return cart.items.reduce(
    (acc, item) => ({
      quantity: acc.quantity + item.quantity,
      subtotal: acc.subtotal + item.quantity * item.unitPrice,
    }),
    { quantity: 0, subtotal: 0 },
  );
}
