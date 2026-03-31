import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetProductBySlugUseCase } from '../../application/use-cases/get-product-by-slug.use-case';
import { ListCategoriesUseCase } from '../../application/use-cases/list-categories.use-case';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case';
import { CreateCategoryUseCase } from '../../application/use-cases/create-category.use-case';
import { UpdateCategoryUseCase } from '../../application/use-cases/update-category.use-case';
import { DeleteCategoryUseCase } from '../../application/use-cases/delete-category.use-case';
import type { CreateProductInput, UpdateProductInput } from '../../domain/repositories/products.repository';
import type { CreateCategoryInput, UpdateCategoryInput } from '../../domain/repositories/categories.repository';

@Controller()
export class ProductsController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductBySlugUseCase: GetProductBySlugUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
    private readonly deleteCategoryUseCase: DeleteCategoryUseCase,
  ) {}

  // ─── Public ───────────────────────────────────────────────────────────────

  @MessagePattern('products.findAll')
  findAll() {
    return this.listProductsUseCase.execute();
  }

  @MessagePattern('products.findBySlug')
  findBySlug(@Payload() payload: { slug: string }) {
    return this.getProductBySlugUseCase.execute(payload.slug);
  }

  @MessagePattern('categories.findAll')
  findAllCategories() {
    return this.listCategoriesUseCase.execute();
  }

  // ─── Admin — Products ─────────────────────────────────────────────────────

  @MessagePattern('products.create')
  createProduct(@Payload() payload: CreateProductInput) {
    return this.createProductUseCase.execute(payload);
  }

  @MessagePattern('products.update')
  updateProduct(@Payload() payload: { id: number } & UpdateProductInput) {
    const { id, ...data } = payload;
    return this.updateProductUseCase.execute(id, data);
  }

  @MessagePattern('products.delete')
  deleteProduct(@Payload() payload: { id: number }) {
    return this.deleteProductUseCase.execute(payload.id);
  }

  // ─── Admin — Categories ───────────────────────────────────────────────────

  @MessagePattern('categories.create')
  createCategory(@Payload() payload: CreateCategoryInput) {
    return this.createCategoryUseCase.execute(payload);
  }

  @MessagePattern('categories.update')
  updateCategory(@Payload() payload: { id: number } & UpdateCategoryInput) {
    const { id, ...data } = payload;
    return this.updateCategoryUseCase.execute(id, data);
  }

  @MessagePattern('categories.delete')
  deleteCategory(@Payload() payload: { id: number }) {
    return this.deleteCategoryUseCase.execute(payload.id);
  }
}
