import { listCatalogProducts } from "../../infrastructure/repositories/catalog.repository";

export async function listProductsUseCase() {
  const products = await listCatalogProducts();
  return products;
}
