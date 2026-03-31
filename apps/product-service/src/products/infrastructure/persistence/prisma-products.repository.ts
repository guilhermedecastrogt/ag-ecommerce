import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductPrismaService } from '../../../product-prisma.service';
import { ProductEntity } from '../../domain/entities/product';
import {
  CreateProductInput,
  ProductsRepository,
  UpdateProductInput,
} from '../../domain/repositories/products.repository';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private readonly prisma: ProductPrismaService) {}

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { id: 'asc' },
    });
    return products.map((p) => this.toDomain(p));
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const p = await this.prisma.product.findUnique({ where: { slug } });
    if (!p) return null;
    return this.toDomain(p);
  }

  async findById(id: number): Promise<ProductEntity | null> {
    const p = await this.prisma.product.findUnique({ where: { id } });
    if (!p) return null;
    return this.toDomain(p);
  }

  async create(data: CreateProductInput): Promise<ProductEntity> {
    const p = await this.prisma.product.create({ data });
    return this.toDomain(p);
  }

  async update(id: number, data: UpdateProductInput): Promise<ProductEntity> {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    const p = await this.prisma.product.update({ where: { id }, data });
    return this.toDomain(p);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.prisma.product.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Product not found');

    await this.prisma.product.delete({ where: { id } });
  }

  private toDomain(p: {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    description: string;
    imageUrl: string;
    categoryId: number;
    createdAt: Date;
    updatedAt: Date;
  }): ProductEntity {
    return new ProductEntity(
      p.id,
      p.name,
      p.slug,
      p.price,
      p.stock,
      p.description,
      p.imageUrl,
      p.categoryId,
      p.createdAt,
      p.updatedAt,
    );
  }
}
