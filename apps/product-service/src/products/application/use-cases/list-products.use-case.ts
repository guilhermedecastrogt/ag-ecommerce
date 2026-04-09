import { Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from '../../domain/entities/product';
import type { ProductsRepository } from '../../domain/repositories/products.repository';
import { PRODUCTS_REPOSITORY } from '../../tokens';

@Injectable()
export class ListProductsUseCase {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  execute(): Promise<ProductEntity[]> {
    return this.productsRepository.findAll();
  }
}
