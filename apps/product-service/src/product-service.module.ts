import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductPrismaService } from './product-prisma.service';
import { GetProductBySlugUseCase } from './products/application/use-cases/get-product-by-slug.use-case';
import { ListCategoriesUseCase } from './products/application/use-cases/list-categories.use-case';
import { ListProductsUseCase } from './products/application/use-cases/list-products.use-case';
import { KafkaProductsEventsPublisher } from './products/infrastructure/messaging/kafka-products-events.publisher';
import { PrismaCategoriesRepository } from './products/infrastructure/persistence/prisma-categories.repository';
import { PrismaProductsRepository } from './products/infrastructure/persistence/prisma-products.repository';
import { ProductsController } from './products/presentation/controllers/products.controller';
import {
  CATEGORIES_REPOSITORY,
  PRODUCTS_EVENTS_PUBLISHER,
  PRODUCTS_REPOSITORY,
} from './products/tokens';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCTS_KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'product-service',
            brokers: [process.env.KAFKA_BROKER ?? 'kafka:9092'],
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [ProductsController],
  providers: [
    ProductPrismaService,
    ListProductsUseCase,
    GetProductBySlugUseCase,
    ListCategoriesUseCase,
    PrismaProductsRepository,
    PrismaCategoriesRepository,
    KafkaProductsEventsPublisher,
    {
      provide: PRODUCTS_REPOSITORY,
      useExisting: PrismaProductsRepository,
    },
    {
      provide: CATEGORIES_REPOSITORY,
      useExisting: PrismaCategoriesRepository,
    },
    {
      provide: PRODUCTS_EVENTS_PUBLISHER,
      useExisting: KafkaProductsEventsPublisher,
    },
  ],
})
export class ProductServiceModule {}
