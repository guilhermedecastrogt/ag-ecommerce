import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { sendWithContext } from '../common/helpers/send-with-context';
import { withResilience } from '../common/helpers/resilience';

@Controller()
export class ProductsController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
    private readonly cls: ClsService,
  ) {}

  // ─── Public ──────────────────────────────────────────────────────────────────

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

  // ─── Admin — Products ────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/products')
  async createProduct(@Body() body: unknown) {
    return firstValueFrom(
      withResilience(
        sendWithContext(this.productClient, 'products.create', body, this.cls),
        { timeoutMs: 8000, retries: 1 },
      ),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('admin/products/:id')
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: unknown,
  ) {
    return firstValueFrom(
      withResilience(
        sendWithContext(
          this.productClient,
          'products.update',
          { id, ...(body as object) },
          this.cls,
        ),
        { timeoutMs: 8000, retries: 1 },
      ),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/products/:id')
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return firstValueFrom(
      withResilience(
        sendWithContext(
          this.productClient,
          'products.delete',
          { id },
          this.cls,
        ),
        { timeoutMs: 8000, retries: 1 },
      ),
    );
  }

  // ─── Admin — Categories ──────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/categories')
  async createCategory(@Body() body: unknown) {
    return firstValueFrom(
      withResilience(
        sendWithContext(
          this.productClient,
          'categories.create',
          body,
          this.cls,
        ),
        { timeoutMs: 8000, retries: 1 },
      ),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('admin/categories/:id')
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: unknown,
  ) {
    return firstValueFrom(
      withResilience(
        sendWithContext(
          this.productClient,
          'categories.update',
          { id, ...(body as object) },
          this.cls,
        ),
        { timeoutMs: 8000, retries: 1 },
      ),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/categories/:id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return firstValueFrom(
      withResilience(
        sendWithContext(
          this.productClient,
          'categories.delete',
          { id },
          this.cls,
        ),
        { timeoutMs: 8000, retries: 1 },
      ),
    );
  }
}
