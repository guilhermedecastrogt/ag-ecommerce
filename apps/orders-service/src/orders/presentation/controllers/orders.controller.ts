import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import type { CheckoutInput } from '../../application/use-cases/create-order.use-case';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { FindAllOrdersUseCase } from '../../application/use-cases/find-all-orders.use-case';
import { FindOrdersByUserUseCase } from '../../application/use-cases/find-orders-by-user.use-case';
import { CancelOrderUseCase } from '../../application/use-cases/cancel-order.use-case';
import { SyncKnownUserUseCase } from '../../application/use-cases/sync-known-user.use-case';
import { UpdateOrderStatusUseCase } from '../../application/use-cases/update-order-status.use-case';

@Controller()
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
    private readonly findOrdersByUserUseCase: FindOrdersByUserUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly syncKnownUserUseCase: SyncKnownUserUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {}

  @MessagePattern('orders.checkout')
  checkout(@Payload() payload: CheckoutInput) {
    return this.createOrderUseCase.execute(payload);
  }

  @MessagePattern('orders.findAll')
  findAll() {
    return this.findAllOrdersUseCase.execute();
  }

  @MessagePattern('orders.findByUser')
  findByUser(@Payload() payload: { userId: number }) {
    return this.findOrdersByUserUseCase.execute(payload.userId);
  }

  @MessagePattern('orders.cancel')
  cancel(@Payload() payload: { orderId: number; userId: number }) {
    return this.cancelOrderUseCase.execute(payload);
  }

  @MessagePattern('orders.updateStatus')
  updateStatus(@Payload() payload: { orderId: number; status: string }) {
    return this.updateOrderStatusUseCase.execute(payload);
  }

  @EventPattern('users.user-created.v1')
  async syncKnownUser(
    @Payload()
    payload: {
      id: number;
      name: string;
      email: string;
      createdAt: string;
    },
  ) {
    await this.syncKnownUserUseCase.execute(payload);
  }
}
