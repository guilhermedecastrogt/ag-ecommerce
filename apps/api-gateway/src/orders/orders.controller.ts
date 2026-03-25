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
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import type { CheckoutDto } from './dtos/checkout.dto';
import type { OrderDto } from './dtos/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('checkout')
  async checkout(
    @Body() payload: CheckoutDto,
    @Req() req: { user: { sub: number } },
  ): Promise<OrderDto> {
    return firstValueFrom(
      this.ordersClient.send<OrderDto>('orders.checkout', {
        userId: req.user.sub,
        items: payload.items,
        shippingFee: payload.shippingFee,
        discount: payload.discount,
        addressSnapshot: payload.addressSnapshot,
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-orders')
  async findMyOrders(
    @Req() req: { user: { sub: number } },
  ): Promise<OrderDto[]> {
    return firstValueFrom(
      this.ordersClient.send<OrderDto[]>('orders.findByUser', {
        userId: req.user.sub,
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('cancel')
  async cancel(
    @Body() payload: { orderId: number },
    @Req() req: { user: { sub: number } },
  ): Promise<OrderDto> {
    return firstValueFrom(
      this.ordersClient.send<OrderDto>('orders.cancel', {
        orderId: payload.orderId,
        userId: req.user.sub,
      }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(): Promise<OrderDto[]> {
    return firstValueFrom(
      this.ordersClient.send<OrderDto[], Record<string, never>>(
        'orders.findAll',
        {},
      ),
    );
  }
}
