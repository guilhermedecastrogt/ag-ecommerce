import { Container } from "@/shared/ui/container";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  return (
    <Container>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Categoria: {slug}</h1>
      <p style={{ color: "#6b7280" }}>
        Estrutura pronta para exibir os produtos da categoria selecionada.
      </p>
    </Container>
  );
}
