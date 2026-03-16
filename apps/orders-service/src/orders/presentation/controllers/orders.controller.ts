import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { FindAllOrdersUseCase } from '../../application/use-cases/find-all-orders.use-case';
import { SyncKnownUserUseCase } from '../../application/use-cases/sync-known-user.use-case';

@Controller()
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly findAllOrdersUseCase: FindAllOrdersUseCase,
    private readonly syncKnownUserUseCase: SyncKnownUserUseCase,
  ) {}

  @MessagePattern('orders.create')
  create(@Payload() payload: { userId: number; total: number }) {
    return this.createOrderUseCase.execute(payload);
  }

  @MessagePattern('orders.findAll')
  findAll() {
    return this.findAllOrdersUseCase.execute();
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
