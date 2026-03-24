import { Injectable } from '@nestjs/common';
import { ProductPrismaService } from '../../../product-prisma.service';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CategoriesRepository } from '../../domain/repositories/categories.repository';

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private readonly prisma: ProductPrismaService) {}

  async findAll(): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { id: 'asc' },
    });

    return categories.map((c) => new CategoryEntity(c.id, c.name, c.slug));
  }
}
