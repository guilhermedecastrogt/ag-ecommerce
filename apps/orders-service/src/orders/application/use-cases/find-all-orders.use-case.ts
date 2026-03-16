import { Inject, Injectable } from '@nestjs/common';
import { OrderEntity } from '../../domain/entities/order.entity';
import { ORDERS_REPOSITORY } from '../../tokens';
import type { OrdersRepository } from '../../domain/repositories/orders.repository';

@Injectable()
export class FindAllOrdersUseCase {
  constructor(
    @Inject(ORDERS_REPOSITORY)
    private readonly ordersRepository: OrdersRepository,
  ) {}

  execute(): Promise<OrderEntity[]> {
    return this.ordersRepository.findAll();
  }
}
