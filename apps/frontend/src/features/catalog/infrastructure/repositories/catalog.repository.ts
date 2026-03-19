import { CatalogProduct } from "../../domain/product";

export async function listCatalogProducts(): Promise<CatalogProduct[]> {
  return [
    {
      id: "p1",
      slug: "tenis-running-pro",
      name: "Tênis Running Pro",
      brand: "Move",
      price: 399.9,
      imageUrl: "/globe.svg",
      category: "calcados",
      tags: ["esporte", "corrida"],
    },
    {
      id: "p2",
      slug: "jaqueta-urban",
      name: "Jaqueta Urban",
      brand: "North",
      price: 249.9,
      imageUrl: "/file.svg",
      category: "vestuario",
      tags: ["inverno", "casual"],
    },
  ];
}
