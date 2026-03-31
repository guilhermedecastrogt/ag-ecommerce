import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ShippingPrismaService } from '../../shipping-prisma.service';

@Injectable()
export class HandleOauthCallbackUseCase {
  constructor(private prisma: ShippingPrismaService) {}

  async execute(code: string) {
    const baseUrl = process.env.MELHOR_ENVIO_API_URL || 'https://sandbox.melhorenvio.com.br';
    const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
    const clientSecret = process.env.MELHOR_ENVIO_CLIENT_SECRET;
    const redirectUri = process.env.MELHOR_ENVIO_REDIRECT_URI;

    const payload = {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    };

    try {
      const response = await fetch(`${baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': process.env.MELHOR_ENVIO_USER_AGENT || 'ag-ecommerce (suporte@ecommerce.com)'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`Failed to exchange token: ${err}`);
      }

      const data = await response.json();
      
      const expiresAt = new Date(Date.now() + (data.expires_in * 1000));

      await this.prisma.melhorEnvioToken.upsert({
        where: { id: 1 },
        update: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt,
        },
        create: {
          id: 1,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt,
        }
      });

      return { success: true };
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Error handling OAuth callback', { cause: e });
    }
  }
}
