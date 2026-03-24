import { ProductEntity } from '../entities/product';

export interface ProductsRepository {
  findAll(): Promise<ProductEntity[]>;
  findBySlug(slug: string): Promise<ProductEntity | null>;
}
