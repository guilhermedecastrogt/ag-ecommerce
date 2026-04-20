import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { sendWithContext } from '../common/helpers/send-with-context';
import { withResilience } from '../common/helpers/resilience';
import type { CheckoutDto } from './dtos/checkout.dto';
import type { OrderDto } from './dtos/order.dto';

interface PaymentResponseDto {
  id: number;
  orderId: number;
  method: string;
  status: string;
  pixQrCode?: string;
  pixQrCodeUrl?: string;
  pixExpiresAt?: string;
  boletoUrl?: string;
  boletoBarcode?: string;
  boletoExpiresAt?: string;
  checkoutUrl?: string;
}

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
    @Inject('PAYMENT_SERVICE') private readonly paymentClient: ClientProxy,
    private readonly cls: ClsService,
  ) {}

  // ─── User ─────────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkout(
    @Body() payload: CheckoutDto,
    @Req() req: { user: { sub: number } },
  ): Promise<{ order: OrderDto; payment: PaymentResponseDto }> {
    const order = await firstValueFrom(
      withResilience(
        sendWithContext<OrderDto>(
          this.ordersClient,
          'orders.checkout',
          {
            userId: req.user.sub,
            items: payload.items,
            shippingFee: payload.shippingFee,
            discount: payload.discount,
            addressSnapshot: payload.addressSnapshot,
          },
          this.cls,
        ),
        { timeoutMs: 8000, retries: 1 },
      ),
    );

    const amountInCents = Math.round(order.total * 100);
    const payment = await firstValueFrom(
      withResilience(
        sendWithContext<PaymentResponseDto>(
          this.paymentClient,
          'payments.create',
          {
            orderId: order.id,
            amount: amountInCents,
            method: payload.paymentMethod,
            provider: payload.provider ?? 'pagarme',
            customer: payload.customer,
            items: payload.items.map((item) => ({
              productId: item.productId,
              name: item.name,
              amount: Math.round(item.price * 100),
              quantity: item.quantity,
            })),
          },
          this.cls,
        ),
        { timeoutMs: 10000, retries: 0 },
      ),
    );

    return { order, payment };
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async findMyOrders(
    @Req() req: { user: { sub: number } },
  ): Promise<OrderDto[]> {
    return firstValueFrom(
      withResilience(
        sendWithContext<OrderDto[]>(
          this.ordersClient,
          'orders.findByUser',
          { userId: req.user.sub },
          this.cls,
        ),
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel')
  async cancel(
    @Body() payload: { orderId: number },
    @Req() req: { user: { sub: number } },
  ): Promise<OrderDto> {
    return firstValueFrom(
      withResilience(
        sendWithContext<OrderDto>(
          this.ordersClient,
          'orders.cancel',
          { orderId: payload.orderId, userId: req.user.sub },
          this.cls,
        ),
        { timeoutMs: 8000, retries: 1 },
      ),
    );
  }

  // ─── Admin ────────────────────────────────────────────────────────────────

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll(): Promise<OrderDto[]> {
    return firstValueFrom(
      withResilience(
        sendWithContext<OrderDto[]>(
          this.ordersClient,
          'orders.findAll',
          {},
          this.cls,
        ),
      ),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string },
  ): Promise<OrderDto> {
    return firstValueFrom(
      withResilience(
        sendWithContext<OrderDto>(
          this.ordersClient,
          'orders.updateStatus',
          { orderId: id, status: body.status },
          this.cls,
        ),
        { timeoutMs: 8000, retries: 1 },
      ),
    );
  }
}
