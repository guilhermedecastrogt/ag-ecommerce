import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { Container } from "@/shared/ui/container";

export default function LoginPage() {
  return (
    <Container>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Entrar</h1>
      <p style={{ color: "#6b7280", marginBottom: 16 }}>
        Área reservada para autenticação de clientes.
      </p>
      <Link href={routes.register}>Criar conta</Link>
    </Container>
  );
}
