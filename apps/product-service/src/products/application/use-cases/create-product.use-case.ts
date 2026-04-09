import { Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from '../../domain/entities/product';
import {
  CreateProductInput,
  type ProductsRepository,
} from '../../domain/repositories/products.repository';
import { PRODUCTS_REPOSITORY } from '../../tokens';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  execute(data: CreateProductInput): Promise<ProductEntity> {
    return this.productsRepository.create(data);
  }
}
