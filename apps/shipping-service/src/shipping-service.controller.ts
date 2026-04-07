import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { RedirectOauthUseCase } from './application/use-cases/redirect-oauth.use-case';
import { HandleOauthCallbackUseCase } from './application/use-cases/handle-oauth-callback.use-case';
import { CalculateFreightUseCase } from './application/use-cases/calculate-freight.use-case';
import type { CalculateFreightDto } from './application/use-cases/calculate-freight.use-case';
import { PurchaseLabelUseCase } from './application/use-cases/purchase-label.use-case';
import type { OrderPaidPayload } from './application/use-cases/purchase-label.use-case';

@Controller()
export class ShippingServiceController {
  private readonly logger = new Logger(ShippingServiceController.name);

  constructor(
    private readonly redirectOauth: RedirectOauthUseCase,
    private readonly handleCallback: HandleOauthCallbackUseCase,
    private readonly calculateFreightUc: CalculateFreightUseCase,
    private readonly purchaseLabelUc: PurchaseLabelUseCase,
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

  @EventPattern('order.paid')
  async handleOrderPaid(@Payload() payload: OrderPaidPayload) {
    this.logger.log(`Received order.paid for orderId=${payload?.orderId}`);
    await this.purchaseLabelUc.execute(payload);
  }
}
