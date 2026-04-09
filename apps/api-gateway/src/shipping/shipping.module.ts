import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ShippingController } from './shipping.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'SHIPPING_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.SHIPPING_SERVICE_HOST || 'shipping-service',
          port: Number(process.env.SHIPPING_SERVICE_PORT ?? 4005),
        },
      },
    ]),
  ],
  controllers: [ShippingController],
})
export class ShippingModule {}
