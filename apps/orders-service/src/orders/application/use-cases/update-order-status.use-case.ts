import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderStatus } from '../../domain/entities/order-status.enum';
import type { OrdersRepository } from '../../domain/repositories/orders.repository';
import type { OrdersEventsPublisher } from '../ports/orders-events.publisher';
import {
  ORDERS_EVENTS_PUBLISHER,
  ORDERS_REPOSITORY,
} from '../../tokens';

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepository,
    @Inject(ORDERS_EVENTS_PUBLISHER)
    private readonly ordersEventsPublisher: OrdersEventsPublisher,
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

    const updated = await this.ordersRepository.updateStatus(
      input.orderId,
      input.status as OrderStatus,
    );

    if (input.status === OrderStatus.PAID) {
      await this.ordersEventsPublisher.publishOrderPaid(updated);
    }

    return updated;
  }
}
