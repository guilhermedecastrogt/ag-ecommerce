import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePaymentUseCase } from '../../application/use-cases/create-payment.use-case';
import { ProcessWebhookUseCase } from '../../application/use-cases/process-webhook.use-case';
import type { CreatePaymentInput } from '../../application/dtos/create-payment.dto';
import type { WebhookPayload } from '../../application/use-cases/process-webhook.use-case';

@Controller()
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly processWebhookUseCase: ProcessWebhookUseCase,
  ) {}

  @MessagePattern('payments.create')
  createPayment(@Payload() payload: CreatePaymentInput) {
    return this.createPaymentUseCase.execute(payload);
  }

  @EventPattern('payments.webhook-received.v1')
  async handleWebhook(@Payload() payload: WebhookPayload) {
    this.logger.log(`Received webhook event: type=${payload?.type}`);
    await this.processWebhookUseCase.execute(payload);
  }
}
