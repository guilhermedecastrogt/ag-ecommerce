import {
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class ProductsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
  ) {}

  @Get('products')
  async findProducts() {
    return firstValueFrom(this.productClient.send('products.findAll', {}));
  }

  @Get('products/:slug')
  async findProductBySlug(@Param('slug') slug: string) {
    try {
      return await firstValueFrom(
        this.productClient.send('products.findBySlug', { slug }),
      );
    } catch (error) {
      throw new HttpException(
        error?.message ?? 'Internal server error',
        error?.statusCode ?? 500,
      );
    }
  }

  @Get('categories')
  async findCategories() {
    return firstValueFrom(this.productClient.send('categories.findAll', {}));
  }
}
