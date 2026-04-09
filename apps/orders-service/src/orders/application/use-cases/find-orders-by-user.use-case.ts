import { Inject, Injectable } from '@nestjs/common';
import { OrderEntity } from '../../domain/entities/order.entity';
import { ORDERS_REPOSITORY } from '../../tokens';
import type { OrdersRepository } from '../../domain/repositories/orders.repository';

@Injectable()
export class FindOrdersByUserUseCase {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepository,
  ) {}

  execute(userId: number): Promise<OrderEntity[]> {
    return this.ordersRepository.findByUserId(userId);
  }
}
