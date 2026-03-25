import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Segurança: cabeçalhos HTTP seguros
  app.use(helmet());

  // CORS restritivo — permite apenas o domínio do frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Validação global: rejeita payloads malformados automaticamente
  app.useGlobalPipes(new ZodValidationPipe());

  await app.listen(Number(process.env.PORT ?? 3000), '0.0.0.0');
}
void bootstrap();
