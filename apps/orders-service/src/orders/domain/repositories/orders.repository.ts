import { OrderEntity } from '../entities/order.entity';
import { OrderStatus } from '../entities/order-status.enum';

export interface CreateOrderInput {
  userId: number;
  status: OrderStatus;
  subTotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  addressSnapshot: string | null;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export interface OrdersRepository {
  create(data: CreateOrderInput): Promise<OrderEntity>;
  findAll(): Promise<OrderEntity[]>;
  findById(id: number): Promise<OrderEntity | null>;
  findByUserId(userId: number): Promise<OrderEntity[]>;
  updateStatus(id: number, status: OrderStatus): Promise<OrderEntity>;
}
