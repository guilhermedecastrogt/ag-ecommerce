import { Injectable } from '@nestjs/common';
import { ProductPrismaService } from '../../../product-prisma.service';
import { ProductEntity } from '../../domain/entities/product';
import { ProductsRepository } from '../../domain/repositories/products.repository';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private readonly prisma: ProductPrismaService) {}

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      orderBy: { id: 'asc' },
    });

    return products.map(
      (p) =>
        new ProductEntity(
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
        ),
    );
  }

  async findBySlug(slug: string): Promise<ProductEntity | null> {
    const p = await this.prisma.product.findUnique({ where: { slug } });

    if (!p) {
      return null;
    }

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
