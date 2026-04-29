import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDERS_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ORDERS_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.ORDERS_SERVICE_PORT ?? 4002),
        },
      },
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.AUTH_SERVICE_PORT ?? 4003),
        },
      },
      {
        name: 'PRODUCT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PRODUCTS_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PRODUCTS_SERVICE_PORT ?? 4004),
        },
      },
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.PAYMENT_SERVICE_HOST ?? 'localhost',
          port: Number(process.env.PAYMENT_SERVICE_PORT ?? 4006),
        },
      },
    ]),
  ],
  controllers: [OrdersController],
})
export class OrdersModule {}
