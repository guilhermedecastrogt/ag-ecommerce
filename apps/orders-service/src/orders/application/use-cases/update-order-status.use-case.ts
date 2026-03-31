import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderStatus } from '../../domain/entities/order-status.enum';
import type { OrdersRepository } from '../../domain/repositories/orders.repository';
import { ORDERS_REPOSITORY } from '../../tokens';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepository,
  ) {}

  async execute(input: {
    orderId: number;
    status: string;
  }): Promise<OrderEntity> {
    const validStatuses = Object.values(OrderStatus) as string[];
    if (!validStatuses.includes(input.status)) {
      throw new BadRequestException(
        `Invalid status. Allowed: ${validStatuses.join(', ')}`,
      );
    }

    const order = await this.ordersRepository.findById(input.orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.ordersRepository.updateStatus(
      input.orderId,
      input.status as OrderStatus,
    );
  }
}
