import { listProductsUseCase } from "@/features/catalog/application/use-cases/list-products.use-case";
import { ProductCard } from "@/features/catalog/presentation/components/product-card";
import { Container } from "@/shared/ui/container";

export default async function HomePage() {
  const products = await listProductsUseCase();

  return (
    <Container>
      <section style={{ display: "grid", gap: 12, marginBottom: 32 }}>
        <h1 style={{ fontSize: 32 }}>Loja E-commerce</h1>
        <p style={{ color: "#6b7280" }}>
          Estrutura inicial pronta para catálogo, carrinho, checkout e conta.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </Container>
  );
}
