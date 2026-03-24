import { CategoryEntity } from '../entities/category.entity';

export interface CategoriesRepository {
  findAll(): Promise<CategoryEntity[]>;
}
