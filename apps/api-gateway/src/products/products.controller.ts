import { Controller, Get, HttpException, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import { sendWithContext } from '../common/helpers/send-with-context';
import { withResilience } from '../common/helpers/resilience';

@Controller()
export class ProductsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
    private readonly cls: ClsService,
  ) {}

  @Get('products')
  async findProducts() {
    return firstValueFrom(
      withResilience(
        sendWithContext(this.productClient, 'products.findAll', {}, this.cls),
      ),
    );
  }

  @Get('products/:slug')
  async findProductBySlug(@Param('slug') slug: string) {
    try {
      return await firstValueFrom(
        withResilience(
          sendWithContext(
            this.productClient,
            'products.findBySlug',
            { slug },
            this.cls,
          ),
        ),
      );
    } catch (error) {
      throw new HttpException(
        (error as { message?: string })?.message ?? 'Internal server error',
        (error as { statusCode?: number })?.statusCode ?? 500,
      );
    }
  }

  @Get('categories')
  async findCategories() {
    return firstValueFrom(
      withResilience(
        sendWithContext(this.productClient, 'categories.findAll', {}, this.cls),
      ),
    );
  }
}
