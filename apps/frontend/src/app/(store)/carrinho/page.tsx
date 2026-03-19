import { getCartSummaryUseCase } from "@/features/cart/application/use-cases/get-cart-summary.use-case";
import { formatCurrency } from "@/shared/lib/currency";
import { Container } from "@/shared/ui/container";

export default function CartPage() {
  const summary = getCartSummaryUseCase({
    items: [{ productId: "p1", name: "Tênis Running Pro", quantity: 1, unitPrice: 399.9 }],
  });

  return (
    <Container>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Carrinho</h1>
      <p style={{ color: "#6b7280", marginBottom: 16 }}>
        Quantidade de itens: {summary.quantity}
      </p>
      <p style={{ fontWeight: 600 }}>Subtotal: {formatCurrency(summary.subtotal)}</p>
    </Container>
  );
}
