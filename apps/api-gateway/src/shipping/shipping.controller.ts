import { Controller, Get, Post, Body, Inject, Query, Res, Param, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import type { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('shipping')
export class ShippingController {
  constructor(
    @Inject('SHIPPING_SERVICE') private readonly shippingClient: ClientProxy,
  ) {}

  @Get('auth')
  async authenticate(@Res() res: Response) {
    const result = await firstValueFrom(
      this.shippingClient.send('shipping.auth.getUrl', {}),
    );
    return res.redirect(result.url);
  }

  @Get('auth/callback')
  async handleCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      return res.status(400).send('Missing authorization code');
    }
    
    await firstValueFrom(
      this.shippingClient.send('shipping.auth.callback', { code }),
    );
    
    return res.send('OAuth2 Integration Successful! The Melhor Envio token is now securely stored in the database.');
  }

  @Post('calculate')
  async calculateFreight(@Body() payload: { toPostalCode: string; items: any[] }) {
    // Inject default parameters from env or hardcoded sandbox values for cart items
    const fromPostalCode = process.env.MELHOR_ENVIO_SENDER_POSTAL_CODE?.replace(/\D/g, '') ?? '01001000';
    const toPostalCode = payload.toPostalCode.replace(/\D/g, '');

    const calculatePayload = {
      fromPostalCode,
      toPostalCode,
      products: payload.items.map((item) => ({
        id: item.productId,
        width: Number(process.env.MELHOR_ENVIO_DEFAULT_WIDTH ?? 15),
        height: Number(process.env.MELHOR_ENVIO_DEFAULT_HEIGHT ?? 10),
        length: Number(process.env.MELHOR_ENVIO_DEFAULT_LENGTH ?? 20),
        weight: Number(process.env.MELHOR_ENVIO_DEFAULT_WEIGHT ?? 0.3),
        insurance_value: Number(item.price),
        quantity: Number(item.quantity)
      }))
    };

    return firstValueFrom(
      this.shippingClient.send('shipping.calculateFreight', calculatePayload),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':orderId')
  async getOrderLabel(@Param('orderId') orderId: string) {
    return firstValueFrom(
      this.shippingClient.send('shipping.getLabelByOrderId', Number(orderId)),
    );
  }
}
