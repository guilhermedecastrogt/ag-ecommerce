import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ProductEntity } from '../../domain/entities/product';
import type { ProductsRepository } from '../../domain/repositories/products.repository';
import { PRODUCTS_REPOSITORY } from '../../tokens';

@Injectable()
export class GetProductBySlugUseCase {
  constructor(
    @Inject(PRODUCTS_REPOSITORY)
    private readonly productsRepository: ProductsRepository,
  ) {}

  async execute(slug: string): Promise<ProductEntity> {
    const product = await this.productsRepository.findBySlug(slug);

    if (!product) {
      throw new RpcException({
        statusCode: 404,
        message: 'Produto não encontrado',
      });
    }

    return product;
  }
}
