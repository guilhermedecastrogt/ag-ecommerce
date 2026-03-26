import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { sendWithContext } from '../common/helpers/send-with-context';
import { withResilience } from '../common/helpers/resilience';
import type { CheckoutDto } from './dtos/checkout.dto';
import type { OrderDto } from './dtos/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
    private readonly cls: ClsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkout(
    @Body() payload: CheckoutDto,
    @Req() req: { user: { sub: number } },
  ): Promise<OrderDto> {
    return firstValueFrom(
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

  @UseGuards(JwtAuthGuard)
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
}
