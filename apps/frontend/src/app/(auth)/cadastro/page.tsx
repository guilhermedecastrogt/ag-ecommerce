import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { Container } from "@/shared/ui/container";

export default function RegisterPage() {
  return (
    <Container>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Cadastro</h1>
      <p style={{ color: "#6b7280", marginBottom: 16 }}>
        Fluxo inicial para registro de cliente no e-commerce.
      </p>
      <Link href={routes.login}>Já tenho conta</Link>
    </Container>
  );
}
