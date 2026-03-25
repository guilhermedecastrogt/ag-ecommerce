import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductsController } from './products.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PRODUCT_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PRODUCT_SERVICE_PORT ?? 4004),
        },
      },
    ]),
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}
