import { Injectable, Logger } from '@nestjs/common';

interface PagarmeOrderRequest {
  code: string;
  customer: {
    name: string;
    email: string;
    document?: string;
    document_type?: string;
    type: string;
    phones?: {
      mobile_phone?: {
        country_code: string;
        area_code: string;
        number: string;
      };
    };
  };
  items: Array<{
    code: string;
    amount: number;
    description: string;
    quantity: number;
  }>;
  payments: unknown[];
}

interface PagarmeOrderResponse {
  id: string;
  code: string;
  status: string;
  charges?: Array<{
    id: string;
    status: string;
    last_transaction?: {
      // PIX
      qr_code?: string;
      qr_code_url?: string;
      expires_at?: string;
      // Boleto
      url?: string;
      line?: string;
      due_at?: string;
      pdf?: { url?: string };
    };
  }>;
  checkouts?: Array<{
    id: string;
    payment_url?: string;
    status?: string;
  }>;
}

@Injectable()
export class PagarmeClient {
  private readonly logger = new Logger(PagarmeClient.name);
  private readonly baseUrl: string;
  private readonly authHeader: string;

  constructor() {
    const apiKey = process.env.PAGARME_API_KEY ?? '';
    this.baseUrl =
      process.env.PAGARME_API_URL ?? 'https://api.pagar.me/core/v5';
    // Pagar.me V5: Basic auth com api_key como usuário e senha vazia
    this.authHeader = `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`;
  }

  async createOrder(data: PagarmeOrderRequest): Promise<PagarmeOrderResponse> {
    const url = `${this.baseUrl}/orders`;
    this.logger.debug(`POST ${url} code=${data.code}`);

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
      this.logger.error(`Pagar.me error ${response.status}: ${body}`);
      throw new Error(`Pagar.me API error ${response.status}: ${body}`);
    }

    return response.json() as Promise<PagarmeOrderResponse>;
  }
}
