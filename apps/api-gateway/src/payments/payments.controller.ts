import {
  Controller,
  Headers,
  HttpCode,
  Inject,
  Logger,
  Post,
  RawBodyRequest,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import type { Request } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { firstValueFrom } from 'rxjs';

@Controller('webhooks')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    @Inject('PAYMENTS_KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  // ─── Pagar.me ──────────────────────────────────────────────────────────────

  @Post('pagarme')
  @HttpCode(200)
  async handlePagarmeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-hub-signature') signature: string,
  ) {
    const rawBody = req.rawBody;
    if (!rawBody) {
      this.logger.warn('Pagar.me webhook received with no raw body');
      return { received: true };
    }

    this.validatePagarmeSignature(rawBody, signature);

    const raw = JSON.parse(rawBody.toString('utf-8')) as {
      type: string;
      data: { id: string; [key: string]: unknown };
    };

    const payload = {
      provider: 'pagarme',
      type: raw.type,
      data: raw.data,
    };

    this.logger.log(`Pagar.me webhook: type=${raw.type}`);
    await firstValueFrom(
      this.kafkaClient.emit('payments.webhook-received.v1', payload),
    );

    return { received: true };
  }

  // ─── PagBank ───────────────────────────────────────────────────────────────

  @Post('pagbank')
  @HttpCode(200)
  async handlePagBankWebhook(@Req() req: RawBodyRequest<Request>) {
    const rawBody = req.rawBody;
    if (!rawBody) {
      this.logger.warn('PagBank webhook received with no raw body');
      return { received: true };
    }

    const raw = JSON.parse(rawBody.toString('utf-8')) as {
      charges?: Array<{
        id: string;
        reference_id?: string;
        status?: string;
        [key: string]: unknown;
      }>;
      [key: string]: unknown;
    };

    const charge = raw.charges?.[0];
    if (!charge) {
      this.logger.warn('PagBank webhook with no charges array');
      return { received: true };
    }

    const payload = {
      provider: 'pagbank',
      type: charge.status ?? 'UNKNOWN',
      data: {
        ...charge,
        referenceId: charge.reference_id,
      },
    };

    this.logger.log(
      `PagBank webhook: chargeId=${charge.id} status=${charge.status}`,
    );
    await firstValueFrom(
      this.kafkaClient.emit('payments.webhook-received.v1', payload),
    );

    return { received: true };
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  private validatePagarmeSignature(rawBody: Buffer, signature: string): void {
    const secret = process.env.PAGARME_WEBHOOK_SECRET;
    if (!secret) {
      this.logger.warn('PAGARME_WEBHOOK_SECRET not set — skipping validation');
      return;
    }

    if (!signature) {
      throw new UnauthorizedException('Missing Pagar.me webhook signature');
    }

    const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
    const sigBuffer = Buffer.from(signature.replace('sha256=', ''), 'hex');
    const expectedBuffer = Buffer.from(expected, 'hex');

    if (
      sigBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      throw new UnauthorizedException('Invalid Pagar.me webhook signature');
    }
  }
}
