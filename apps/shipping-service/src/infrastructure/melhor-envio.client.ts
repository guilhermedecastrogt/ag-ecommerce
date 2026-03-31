import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ShippingPrismaService } from '../shipping-prisma.service';

@Injectable()
export class MelhorEnvioClient {
  private readonly baseUrl = process.env.MELHOR_ENVIO_API_URL || 'https://sandbox.melhorenvio.com.br';
  private readonly userAgent = process.env.MELHOR_ENVIO_USER_AGENT || 'ag-ecommerce (suporte@ecommerce.com)';

  constructor(private prisma: ShippingPrismaService) {}

  private async getToken(): Promise<string> {
    const tokenRecord = await this.prisma.melhorEnvioToken.findUnique({ where: { id: 1 } });
    if (!tokenRecord) {
      throw new UnauthorizedException('App not authorized with Melhor Envio yet. Please visit /shipping/auth.');
    }
    
    // Simplification: In a robust app, we should check `expiresAt` and trigger refreshToken here if expired.
    return tokenRecord.accessToken;
  }

  async calculateFreight(payload: any): Promise<any> {
    const token = await this.getToken();
    
    const response = await fetch(`${this.baseUrl}/api/v2/me/shipment/calculate`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': this.userAgent,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new InternalServerErrorException(`Error calculating freight: ${err}`);
    }

    return response.json();
  }
}
