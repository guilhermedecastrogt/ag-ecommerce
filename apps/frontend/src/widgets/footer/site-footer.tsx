import { Container } from "@/shared/ui/container";

export function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid #e5e7eb", padding: "24px 0" }}>
      <Container>
        <p style={{ fontSize: 14, color: "#6b7280" }}>
          MicrosStore e-commerce • frontend iniciado para evolução incremental
        </p>
      </Container>
    </footer>
  );
}
