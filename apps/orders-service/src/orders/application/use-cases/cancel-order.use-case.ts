import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderStatus } from '../../domain/entities/order-status.enum';
import type { OrdersRepository } from '../../domain/repositories/orders.repository';
import { ORDERS_EVENTS_PUBLISHER, ORDERS_REPOSITORY } from '../../tokens';
import type { OrdersEventsPublisher } from '../ports/orders-events.publisher';

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepository,
    @Inject(ORDERS_EVENTS_PUBLISHER)
    private readonly ordersEventsPublisher: OrdersEventsPublisher,
  ) {}

  async execute(input: {
    orderId: number;
    userId: number;
  }): Promise<OrderEntity> {
    const order = await this.ordersRepository.findById(input.orderId);

    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    if (order.userId !== input.userId) {
      throw new BadRequestException('Pedido não pertence ao usuário');
    }

    if (!order.canBeCancelled) {
      throw new BadRequestException(
        'Somente pedidos com status PENDING podem ser cancelados',
      );
    }

    const cancelledOrder = await this.ordersRepository.updateStatus(
      input.orderId,
      OrderStatus.CANCELLED,
    );

    await this.ordersEventsPublisher.publishOrderCancelled(cancelledOrder);
    return cancelledOrder;
  }
}
