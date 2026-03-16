import { OrderEntity } from '../entities/order.entity';

export interface OrdersRepository {
  create(data: { userId: number; total: number }): Promise<OrderEntity>;
  findAll(): Promise<OrderEntity[]>;
}
