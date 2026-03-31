import { Inject, Injectable } from '@nestjs/common';
import { ProductEntity } from '../../domain/entities/product';
import {
  type ProductsRepository,
  UpdateProductInput,
} from '../../domain/repositories/products.repository';
import { PRODUCTS_REPOSITORY } from '../../tokens';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  execute(id: number, data: UpdateProductInput): Promise<ProductEntity> {
    return this.productsRepository.update(id, data);
  }
}
