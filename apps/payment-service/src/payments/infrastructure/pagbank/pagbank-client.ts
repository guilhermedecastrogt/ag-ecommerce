import { Injectable, Logger } from '@nestjs/common';

export interface PagBankOrderRequest {
  reference_id: string;
  customer: {
    name: string;
    email: string;
    tax_id?: string;
  };
  items: Array<{ reference_id: string; name: string; quantity: number; unit_amount: number }>;
  // PIX
  qr_codes?: Array<{ amount: { value: number }; expiration_date: string }>;
  // Boleto
  charges?: Array<{
    reference_id: string;
    description: string;
    amount: { value: number; currency: 'BRL' };
    payment_method: {
      type: 'BOLETO';
      boleto: {
        due_date: string;
        instruction_lines?: { line_1?: string; line_2?: string };
        holder: {
          name: string;
          email: string;
          tax_id?: string;
          address?: {
            street: string;
            number: string;
            locality: string;
            city: string;
            region: string;
            region_code: string;
            country: string;
            postal_code: string;
          };
        };
      };
    };
  }>;
  notification_urls?: string[];
}

export interface PagBankOrderResponse {
  id: string;
  reference_id: string;
  status?: string;
  // PIX
  qr_codes?: Array<{
    id: string;
    text: string;
    expiration_date: string;
    links?: Array<{ rel: string; href: string }>;
  }>;
  // Boleto
  charges?: Array<{
    id: string;
    status: string;
    payment_method?: {
      type: string;
      boleto?: {
        id: string;
        barcode: string;
        formatted_barcode: string;
        due_date: string;
      };
    };
    links?: Array<{ rel: string; href: string; media?: string }>;
  }>;
}

export interface PagBankCheckoutRequest {
  reference_id: string;
  expiration_date: string;
  customer?: {
    name: string;
    email: string;
    tax_id?: string;
  };
  items: Array<{ reference_id: string; name: string; quantity: number; unit_amount: number }>;
  payment_methods: Array<{ type: string }>;
  redirect_url?: string;
  return_url?: string;
  notification_urls?: string[];
}

export interface PagBankCheckoutResponse {
  id: string;
  reference_id: string;
  links?: Array<{ rel: string; href: string }>;
}

@Injectable()
export class PagBankClient {
  private readonly logger = new Logger(PagBankClient.name);
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor() {
    this.baseUrl =
      process.env.PAGBANK_API_URL ?? 'https://sandbox.api.pagseguro.com';
    this.authHeader = `Bearer ${process.env.PAGBANK_API_KEY ?? ''}`;
  }

  async createOrder(data: PagBankOrderRequest): Promise<PagBankOrderResponse> {
    const url = `${this.baseUrl}/orders`;
    this.logger.debug(`POST ${url} reference_id=${data.reference_id}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`PagBank error ${response.status}: ${body}`);
      throw new Error(`PagBank API error ${response.status}: ${body}`);
    }

    return response.json() as Promise<PagBankOrderResponse>;
  }

  async createCheckout(data: PagBankCheckoutRequest): Promise<PagBankCheckoutResponse> {
    const url = `${this.baseUrl}/checkouts`;
    this.logger.debug(`POST ${url} reference_id=${data.reference_id}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authHeader,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const body = await response.text();
      this.logger.error(`PagBank checkout error ${response.status}: ${body}`);
      throw new Error(`PagBank Checkout API error ${response.status}: ${body}`);
    }

    return response.json() as Promise<PagBankCheckoutResponse>;
  }
}
