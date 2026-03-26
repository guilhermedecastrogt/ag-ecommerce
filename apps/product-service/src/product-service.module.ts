import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { LoggerModule } from 'nestjs-pino';
import { ClsModule } from 'nestjs-cls';
import { ProductPrismaService } from './product-prisma.service';
import { CorrelationInterceptor } from './common/interceptors/correlation.interceptor';
import { HealthModule } from './health/health.module';
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
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty' }
            : undefined,
        customProps: () => ({ service: 'product-service' }),
      },
    }),
    ClsModule.forRoot({ global: true }),
    HealthModule,
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
    { provide: APP_INTERCEPTOR, useClass: CorrelationInterceptor },
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
