import { Module } from '@nestjs/common';
import { ShippingServiceController } from './shipping-service.controller';
import { ShippingPrismaService } from './shipping-prisma.service';
import { RedirectOauthUseCase } from './application/use-cases/redirect-oauth.use-case';
import { HandleOauthCallbackUseCase } from './application/use-cases/handle-oauth-callback.use-case';
import { CalculateFreightUseCase } from './application/use-cases/calculate-freight.use-case';
import { PurchaseLabelUseCase } from './application/use-cases/purchase-label.use-case';
import { GetLabelUseCase } from './application/use-cases/get-label.use-case';
import { MelhorEnvioClient } from './infrastructure/melhor-envio.client';
import { LoggerModule } from 'nestjs-pino';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        customProps: () => ({ service: 'shipping-service' }),
      },
    }),
    HealthModule,
  ],
  controllers: [ShippingServiceController],
  providers: [
    ShippingPrismaService,
    MelhorEnvioClient,
    RedirectOauthUseCase,
    HandleOauthCallbackUseCase,
    CalculateFreightUseCase,
    PurchaseLabelUseCase,
    GetLabelUseCase,
  ],
})
export class ShippingServiceModule {}
