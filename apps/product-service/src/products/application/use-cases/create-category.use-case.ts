import { Inject, Injectable } from '@nestjs/common';
import { CategoryEntity } from '../../domain/entities/category.entity';
import {
  type CategoriesRepository,
  CreateCategoryInput,
} from '../../domain/repositories/categories.repository';
import { CATEGORIES_REPOSITORY } from '../../tokens';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  execute(data: CreateCategoryInput): Promise<CategoryEntity> {
    return this.categoriesRepository.create(data);
  }
}
