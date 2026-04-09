import { Inject, Injectable } from '@nestjs/common';
import { CategoryEntity } from '../../domain/entities/category.entity';
import type { CategoriesRepository } from '../../domain/repositories/categories.repository';
import { CATEGORIES_REPOSITORY } from '../../tokens';

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  execute(): Promise<CategoryEntity[]> {
    return this.categoriesRepository.findAll();
  }
}
