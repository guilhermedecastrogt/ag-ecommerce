import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { RedirectOauthUseCase } from './application/use-cases/redirect-oauth.use-case';
import { HandleOauthCallbackUseCase } from './application/use-cases/handle-oauth-callback.use-case';
import { CalculateFreightUseCase } from './application/use-cases/calculate-freight.use-case';
import type { CalculateFreightDto } from './application/use-cases/calculate-freight.use-case';
import { PurchaseLabelUseCase } from './application/use-cases/purchase-label.use-case';
import type { OrderPaidPayload } from './application/use-cases/purchase-label.use-case';
import { GetLabelUseCase } from './application/use-cases/get-label.use-case';

@Controller()
export class ShippingServiceController {
  private readonly logger = new Logger(ShippingServiceController.name);

  constructor(
    private readonly redirectOauth: RedirectOauthUseCase,
    private readonly handleCallback: HandleOauthCallbackUseCase,
    private readonly calculateFreightUc: CalculateFreightUseCase,
    private readonly purchaseLabelUc: PurchaseLabelUseCase,
    private readonly getLabelUc: GetLabelUseCase,
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

  @MessagePattern('shipping.getLabelByOrderId')
  async getLabel(@Payload() orderId: number) {
    return this.getLabelUc.execute(orderId);
  }

  @EventPattern('order.paid')
  async handleOrderPaid(@Payload() payload: any) {
    let data: typeof payload;
    try {
      data = typeof payload === 'string' ? JSON.parse(payload) : (payload?.value ?? payload);
      // fallback in case value itself is a string stringified json
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
    } catch (e) {
      this.logger.warn('Failed to parse payload for order.paid: ' + payload);
      return;
    }

    if (!data || !data.orderId) {
      this.logger.warn('Received invalid or undefined payload for order.paid: ' + JSON.stringify(payload));
      return;
    }

    this.logger.log(`Received order.paid for orderId=${data.orderId}`);
    await this.purchaseLabelUc.execute(data);
  }
}
