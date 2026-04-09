import { Injectable } from '@nestjs/common';
import { MelhorEnvioClient } from '../../infrastructure/melhor-envio.client';

export interface CalculateFreightDto {
  fromPostalCode: string;
  toPostalCode: string;
  products: {
    id: string;
    width: number;
    height: number;
    length: number;
    weight: number;
    insurance_value: number;
    quantity: number;
  }[];
}

@Injectable()
export class CalculateFreightUseCase {
  constructor(private melhorEnvioClient: MelhorEnvioClient) {}

  async execute(dto: CalculateFreightDto) {
    const payload = {
      from: { postal_code: dto.fromPostalCode },
      to: { postal_code: dto.toPostalCode },
      products: dto.products
    };

    const result = await this.melhorEnvioClient.calculateFreight(payload);

    return result.map((rate: any) => ({
      id: rate.id,
      name: rate.name,
      price: rate.price,
      custom_price: rate.custom_price,
      delivery_time: rate.delivery_time,
      company: rate.company?.name,
      error: rate.error
    }));
  }
}
