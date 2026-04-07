import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ShippingPrismaService } from '../shipping-prisma.service';

export interface CartItemPayload {
  service: number;
  from: {
    name: string;
    phone: string;
    email: string;
    document: string;
    address: string;
    complement?: string;
    number: string;
    district: string;
    city: string;
    country_id: string;
    postal_code: string;
    state_abbr: string;
  };
  to: {
    name: string;
    phone: string;
    email: string;
    document: string;
    address: string;
    complement?: string;
    number: string;
    district: string;
    city: string;
    country_id: string;
    postal_code: string;
    state_abbr: string;
  };
  products: {
    name: string;
    quantity: number;
    unitary_value: number;
    weight: number;
  }[];
  volumes: {
    height: number;
    width: number;
    length: number;
    weight: number;
  }[];
  options: {
    insurance_value: number;
    receipt: boolean;
    own_hand: boolean;
    reverse: boolean;
    non_commercial: boolean;
    tags: { tag: string; url: null }[];
  };
}

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
    return tokenRecord.accessToken;
  }

  private async request<T>(path: string, options: RequestInit): Promise<T> {
    const token = await this.getToken();
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': this.userAgent,
        Authorization: `Bearer ${token}`,
        ...(options.headers ?? {}),
      },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new InternalServerErrorException(`Melhor Envio error [${path}]: ${err}`);
    }

    return response.json() as Promise<T>;
  }

  async calculateFreight(payload: any): Promise<any> {
    return this.request('/api/v2/me/shipment/calculate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /** Insere envio no carrinho virtual do Melhor Envio. Retorna o item do carrinho com o ID. */
  async addToCart(payload: CartItemPayload): Promise<any> {
    return this.request('/api/v2/me/cart', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  /** Finaliza a compra do(s) item(ns) no carrinho, debitando da carteira virtual. */
  async checkoutCart(cartIds: string[]): Promise<any> {
    return this.request('/api/v2/me/shipment/checkout', {
      method: 'POST',
      body: JSON.stringify({ orders: cartIds }),
    });
  }
}
