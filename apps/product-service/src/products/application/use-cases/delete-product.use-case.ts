import { Inject, Injectable } from '@nestjs/common';
import { type ProductsRepository } from '../../domain/repositories/products.repository';
import { PRODUCTS_REPOSITORY } from '../../tokens';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  execute(id: number): Promise<void> {
    return this.productsRepository.delete(id);
  }
}
