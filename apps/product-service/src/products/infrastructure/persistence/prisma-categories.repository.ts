import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductPrismaService } from '../../../product-prisma.service';
import { CategoryEntity } from '../../domain/entities/category.entity';
import {
  CategoriesRepository,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '../../domain/repositories/categories.repository';

@Injectable()
export class PrismaCategoriesRepository implements CategoriesRepository {
  constructor(private readonly prisma: ProductPrismaService) {}

  async findAll(): Promise<CategoryEntity[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: { id: 'asc' },
    });
    return categories.map((c) => new CategoryEntity(c.id, c.name, c.slug));
  }

  async findById(id: number): Promise<CategoryEntity | null> {
    const c = await this.prisma.category.findUnique({ where: { id } });
    if (!c) return null;
    return new CategoryEntity(c.id, c.name, c.slug);
  }

  async create(data: CreateCategoryInput): Promise<CategoryEntity> {
    const c = await this.prisma.category.create({ data });
    return new CategoryEntity(c.id, c.name, c.slug);
  }

  async update(id: number, data: UpdateCategoryInput): Promise<CategoryEntity> {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Category not found');

    const c = await this.prisma.category.update({ where: { id }, data });
    return new CategoryEntity(c.id, c.name, c.slug);
  }

  async delete(id: number): Promise<void> {
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Category not found');

    await this.prisma.category.delete({ where: { id } });
  }
}
