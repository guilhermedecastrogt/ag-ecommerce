import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number(process.env.PORT ?? 4003),
    },
  });

  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  await app.listen(Number(process.env.HEALTH_PORT ?? 4013), '0.0.0.0');
}
void bootstrap();
