import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersServiceModule } from './users-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.HOST ?? '0.0.0.0',
        port: Number(process.env.PORT ?? 4001),
      },
    },
  );
  await app.listen();
}
void bootstrap();
