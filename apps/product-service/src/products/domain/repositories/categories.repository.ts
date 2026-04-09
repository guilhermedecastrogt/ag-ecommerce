import { CategoryEntity } from '../entities/category.entity';

export interface CreateCategoryInput {
  name: string;
  slug: string;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
}

export interface CategoriesRepository {
  findAll(): Promise<CategoryEntity[]>;
  findById(id: number): Promise<CategoryEntity | null>;
  create(data: CreateCategoryInput): Promise<CategoryEntity>;
  update(id: number, data: UpdateCategoryInput): Promise<CategoryEntity>;
  delete(id: number): Promise<void>;
}
