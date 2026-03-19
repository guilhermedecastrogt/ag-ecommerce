import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { Container } from "@/shared/ui/container";

export function SiteHeader() {
  return (
    <header style={{ borderBottom: "1px solid #e5e7eb", padding: "16px 0" }}>
      <Container>
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link href={routes.home} style={{ fontWeight: 700, fontSize: 20 }}>
            MicrosStore
          </Link>
          <div style={{ display: "flex", gap: 20 }}>
            <Link href={routes.products}>Produtos</Link>
            <Link href={routes.cart}>Carrinho</Link>
            <Link href={routes.account}>Conta</Link>
          </div>
        </nav>
      </Container>
    </header>
  );
}
