import { Injectable } from '@nestjs/common';

@Injectable()
export class RedirectOauthUseCase {
  execute() {
    const baseUrl = process.env.MELHOR_ENVIO_API_URL || 'https://sandbox.melhorenvio.com.br';
    const clientId = process.env.MELHOR_ENVIO_CLIENT_ID;
    const redirectUri = process.env.MELHOR_ENVIO_REDIRECT_URI;
    const state = 'secure_random_state';
    const scopes = 'cart-read cart-write companies-read companies-write orders-read products-read products-write shipping-calculate shipping-checkout shipping-generate shipping-tracking transactions-read users-read users-write';

    const redirectUrl = `${baseUrl}/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&state=${state}&scope=${encodeURIComponent(scopes)}`;
    
    return { url: redirectUrl };
  }
}
