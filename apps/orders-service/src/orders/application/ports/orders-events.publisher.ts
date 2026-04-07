import { OrderEntity } from '../../domain/entities/order.entity';

export interface OrdersEventsPublisher {
  publishOrderCreated(order: OrderEntity): Promise<void>;
  publishOrderCancelled(order: OrderEntity): Promise<void>;
  publishOrderPaid(order: OrderEntity): Promise<void>;
}
