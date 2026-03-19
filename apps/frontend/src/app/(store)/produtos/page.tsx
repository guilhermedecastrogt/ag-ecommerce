import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { Container } from "@/shared/ui/container";

export default function ProductsPage() {
  return (
    <Container>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Produtos</h1>
      <p style={{ color: "#6b7280", marginBottom: 20 }}>
        Página dedicada para listagem com filtros, ordenação e paginação.
      </p>
      <Link href={routes.home}>Voltar para home</Link>
    </Container>
  );
}
