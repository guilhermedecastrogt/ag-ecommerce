import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ProductServiceModule } from './product-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductServiceModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.HOST ?? '0.0.0.0',
      port: Number(process.env.PORT ?? 4004),
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'product-service-consumer',
        brokers: [process.env.KAFKA_BROKER ?? 'kafka:9092'],
      },
    },
  });

  await app.startAllMicroservices();
}
void bootstrap();
