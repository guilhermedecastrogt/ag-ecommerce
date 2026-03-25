import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GetProductBySlugUseCase } from '../../application/use-cases/get-product-by-slug.use-case';
import { ListCategoriesUseCase } from '../../application/use-cases/list-categories.use-case';
import { ListProductsUseCase } from '../../application/use-cases/list-products.use-case';

@Controller()
export class ProductsController {
  constructor(
    private readonly listProductsUseCase: ListProductsUseCase,
    private readonly getProductBySlugUseCase: GetProductBySlugUseCase,
    private readonly listCategoriesUseCase: ListCategoriesUseCase,
  ) {}

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
}
