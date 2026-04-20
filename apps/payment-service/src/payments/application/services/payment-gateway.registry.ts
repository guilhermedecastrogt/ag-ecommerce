import { Injectable, BadRequestException } from '@nestjs/common';
import type { PaymentGatewayPort } from '../ports/payment-gateway.port';
import { PagarmeGatewayAdapter } from '../../infrastructure/pagarme/pagarme-gateway.adapter';
import { PagBankGatewayAdapter } from '../../infrastructure/pagbank/pagbank-gateway.adapter';

@Injectable()
export class PaymentGatewayRegistry {
  private readonly gateways: Record<string, PaymentGatewayPort>;

  constructor(
    private readonly pagarme: PagarmeGatewayAdapter,
    private readonly pagbank: PagBankGatewayAdapter,
  ) {
    this.gateways = { pagarme, pagbank };
  }

  get(provider: string): PaymentGatewayPort {
    const gateway = this.gateways[provider];
    if (!gateway) {
      throw new BadRequestException(`Unknown payment provider: ${provider}`);
    }
    return gateway;
  }
}
