import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RedirectOauthUseCase } from './application/use-cases/redirect-oauth.use-case';
import { HandleOauthCallbackUseCase } from './application/use-cases/handle-oauth-callback.use-case';
import { CalculateFreightUseCase } from './application/use-cases/calculate-freight.use-case';
import type { CalculateFreightDto } from './application/use-cases/calculate-freight.use-case';

@Controller()
export class ShippingServiceController {
  constructor(
    private readonly redirectOauth: RedirectOauthUseCase,
    private readonly handleCallback: HandleOauthCallbackUseCase,
    private readonly calculateFreightUc: CalculateFreightUseCase,
  ) {}

  @MessagePattern('shipping.auth.getUrl')
  getAuthUrl() {
    return this.redirectOauth.execute();
  }

  @MessagePattern('shipping.auth.callback')
  async handleAuthCallback(@Payload() payload: { code: string }) {
    return this.handleCallback.execute(payload.code);
  }

  @MessagePattern('shipping.calculateFreight')
  async calculateFreight(@Payload() payload: CalculateFreightDto) {
    return this.calculateFreightUc.execute(payload);
  }
}
