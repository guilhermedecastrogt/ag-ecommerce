import { Test, TestingModule } from '@nestjs/testing';
import { ApiGatewayController } from './api-gateway.controller';

describe('ApiGatewayController', () => {
  let apiGatewayController: ApiGatewayController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApiGatewayController],
      providers: [
        {
          provide: 'USERS_SERVICE',
          useValue: { send: jest.fn() },
        },
        {
          provide: 'ORDERS_SERVICE',
          useValue: { send: jest.fn() },
        },
      ],
    }).compile();

    apiGatewayController = app.get<ApiGatewayController>(ApiGatewayController);
  });

  describe('root', () => {
    it('should return health payload', () => {
      expect(apiGatewayController.getHealth()).toEqual({
        status: 'ok',
        service: 'api-gateway',
      });
    });
  });
});
