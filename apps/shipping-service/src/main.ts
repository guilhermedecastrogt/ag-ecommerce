import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { ShippingServiceModule } from './shipping-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ShippingServiceModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number(process.env.PORT ?? 4005),
    },
  });

  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  await app.listen(Number(process.env.HEALTH_PORT ?? 4015), '0.0.0.0');
}
void bootstrap();
