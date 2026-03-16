import { Test, TestingModule } from '@nestjs/testing';
import { OrdersServiceController } from './orders-service.controller';
import { CreateOrderUseCase } from './orders/application/use-cases/create-order.use-case';
import { FindAllOrdersUseCase } from './orders/application/use-cases/find-all-orders.use-case';
import { SyncKnownUserUseCase } from './orders/application/use-cases/sync-known-user.use-case';

describe('OrdersServiceController', () => {
  let ordersServiceController: OrdersServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersServiceController],
      providers: [
        {
          provide: CreateOrderUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindAllOrdersUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: SyncKnownUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    ordersServiceController = app.get<OrdersServiceController>(
      OrdersServiceController,
    );
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(ordersServiceController).toBeDefined();
    });
  });
});
