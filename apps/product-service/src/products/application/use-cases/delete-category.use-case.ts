import { Inject, Injectable } from '@nestjs/common';
import { type CategoriesRepository } from '../../domain/repositories/categories.repository';
import { CATEGORIES_REPOSITORY } from '../../tokens';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(
    @Inject(CATEGORIES_REPOSITORY)
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  execute(id: number): Promise<void> {
    return this.categoriesRepository.delete(id);
  }
}
