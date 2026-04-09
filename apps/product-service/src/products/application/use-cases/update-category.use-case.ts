import { Inject, Injectable } from '@nestjs/common';
import { CategoryEntity } from '../../domain/entities/category.entity';
import {
  type CategoriesRepository,
  UpdateCategoryInput,
} from '../../domain/repositories/categories.repository';
import { CATEGORIES_REPOSITORY } from '../../tokens';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  execute(id: number, data: UpdateCategoryInput): Promise<CategoryEntity> {
    return this.categoriesRepository.update(id, data);
  }
}
