import { ProductEntity } from '../entities/product';

export interface CreateProductInput {
  name: string;
  slug: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
  categoryId: number;
}

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  price?: number;
  stock?: number;
  description?: string;
  imageUrl?: string;
  categoryId?: number;
}

export interface ProductsRepository {
  findAll(): Promise<ProductEntity[]>;
  findBySlug(slug: string): Promise<ProductEntity | null>;
  findById(id: number): Promise<ProductEntity | null>;
  create(data: CreateProductInput): Promise<ProductEntity>;
  update(id: number, data: UpdateProductInput): Promise<ProductEntity>;
  delete(id: number): Promise<void>;
}
