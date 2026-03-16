import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OrderEntity } from '../../domain/entities/order.entity';
import type { KnownUsersRepository } from '../../domain/repositories/known-users.repository';
import type { OrdersRepository } from '../../domain/repositories/orders.repository';
import {
  KNOWN_USERS_REPOSITORY,
  ORDERS_EVENTS_PUBLISHER,
  ORDERS_REPOSITORY,
} from '../../tokens';
import type { OrdersEventsPublisher } from '../ports/orders-events.publisher';

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepository,
    @Inject(KNOWN_USERS_REPOSITORY)
    private readonly knownUsersRepository: KnownUsersRepository,
    @Inject(ORDERS_EVENTS_PUBLISHER)
    private readonly ordersEventsPublisher: OrdersEventsPublisher,
  ) {}

  async execute(input: {
    userId: number;
    total: number;
  }): Promise<OrderEntity> {
    const knownUser = await this.knownUsersRepository.findById(input.userId);

    if (!knownUser) {
      throw new NotFoundException('Usuário não encontrado no catálogo local');
    }

    const createdOrder = await this.ordersRepository.create(input);
    await this.ordersEventsPublisher.publishOrderCreated(createdOrder);
    return createdOrder;
  }
}
