import Link from "next/link";

import { CatalogProduct } from "../../domain/product";
import { formatCurrency } from "@/shared/lib/currency";
import { routes } from "@/shared/config/routes";

type ProductCardProps = {
  product: CatalogProduct;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: 16,
        display: "grid",
        gap: 8,
      }}
    >
      <p style={{ fontSize: 12, color: "#6b7280" }}>{product.brand}</p>
      <h3 style={{ fontSize: 18 }}>{product.name}</h3>
      <p style={{ fontWeight: 600 }}>{formatCurrency(product.price)}</p>
      <Link href={routes.category(product.category)}>Ver categoria</Link>
    </article>
  );
}
