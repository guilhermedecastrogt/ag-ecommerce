import { Module } from '@nestjs/common';
import { ShippingServiceController } from './shipping-service.controller';
import { ShippingPrismaService } from './shipping-prisma.service';
import { RedirectOauthUseCase } from './application/use-cases/redirect-oauth.use-case';
import { HandleOauthCallbackUseCase } from './application/use-cases/handle-oauth-callback.use-case';
import { CalculateFreightUseCase } from './application/use-cases/calculate-freight.use-case';
import { MelhorEnvioClient } from './infrastructure/melhor-envio.client';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        customProps: () => ({ service: 'shipping-service' }),
      },
    }),
  ],
  controllers: [ShippingServiceController],
  providers: [
    ShippingPrismaService,
    MelhorEnvioClient,
    RedirectOauthUseCase,
    HandleOauthCallbackUseCase,
    CalculateFreightUseCase,
  ],
})
export class ShippingServiceModule {}
