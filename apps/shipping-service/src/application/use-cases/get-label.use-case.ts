import { Injectable } from '@nestjs/common';
import { ShippingPrismaService } from '../../shipping-prisma.service';

@Injectable()
export class GetLabelUseCase {
  constructor(private readonly prisma: ShippingPrismaService) {}

  async execute(orderId: number) {
    const label = await this.prisma.shipmentLabel.findUnique({
      where: { orderId },
    });
    return label;
  }
}
