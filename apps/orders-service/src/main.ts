import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { OrdersServiceModule } from './orders-service.module';

async function bootstrap() {
  const app = await NestFactory.create(OrdersServiceModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.HOST ?? '0.0.0.0',
      port: Number(process.env.PORT ?? 4002),
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'orders-service-consumer',
        brokers: [process.env.KAFKA_BROKER ?? 'kafka:9092'],
      },
    },
  });

  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  await app.listen(Number(process.env.HEALTH_PORT ?? 4012), '0.0.0.0');
}
void bootstrap();
