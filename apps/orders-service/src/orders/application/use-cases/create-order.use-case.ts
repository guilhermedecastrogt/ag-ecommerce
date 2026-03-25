import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderEntity } from '../../domain/entities/order.entity';
import { OrderStatus } from '../../domain/entities/order-status.enum';
import type { KnownUsersRepository } from '../../domain/repositories/known-users.repository';
import type { OrdersRepository } from '../../domain/repositories/orders.repository';
import {
  KNOWN_USERS_REPOSITORY,
  ORDERS_EVENTS_PUBLISHER,
  ORDERS_REPOSITORY,
} from '../../tokens';
import type { OrdersEventsPublisher } from '../ports/orders-events.publisher';

export interface CheckoutItemInput {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutInput {
  userId: number;
  items: CheckoutItemInput[];
  shippingFee?: number;
  discount?: number;
  addressSnapshot?: string | null;
}

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

  async execute(input: CheckoutInput): Promise<OrderEntity> {
    if (!input.items.length) {
      throw new BadRequestException('O pedido deve conter ao menos um item');
    }

    const knownUser = await this.knownUsersRepository.findById(input.userId);
    if (!knownUser) {
      throw new NotFoundException('Usuário não encontrado no catálogo local');
    }

    const shippingFee = input.shippingFee ?? 0;
    const discount = input.discount ?? 0;

    const { subTotal, total } = OrderEntity.calculateTotals(
      input.items,
      shippingFee,
      discount,
    );

    const createdOrder = await this.ordersRepository.create({
      userId: input.userId,
      status: OrderStatus.PENDING,
      subTotal,
      shippingFee,
      discount,
      total,
      addressSnapshot: input.addressSnapshot ?? null,
      items: input.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });

    await this.ordersEventsPublisher.publishOrderCreated(createdOrder);
    return createdOrder;
  }
}
