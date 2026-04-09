import { Controller, Get, Post, Body, Inject, Query, Res } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import type { Response } from 'express';
import { firstValueFrom } from 'rxjs';

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
  async calculateFreight(@Body() payload: any) {
    return firstValueFrom(
      this.shippingClient.send('shipping.calculateFreight', payload),
    );
  }
}
