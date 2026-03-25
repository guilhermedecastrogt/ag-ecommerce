import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ProductsEventsPublisher } from '../../application/ports/products-events.publisher';
import { ProductEntity } from '../../domain/entities/product';

@Injectable()
export class KafkaProductsEventsPublisher
  implements ProductsEventsPublisher, OnModuleInit
{
  constructor(
    @Inject('PRODUCTS_KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
  }

  async publishProductCreated(product: ProductEntity): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit('product.created', this.serialize(product)),
    );
  }

  async publishProductUpdated(product: ProductEntity): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit('product.updated', this.serialize(product)),
    );
  }

  async publishStockUpdated(product: ProductEntity): Promise<void> {
    await firstValueFrom(
      this.kafkaClient.emit('product.stock_updated', {
        id: product.id,
        slug: product.slug,
        stock: product.stock,
      }),
    );
  }

  private serialize(product: ProductEntity) {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };
  }
}
