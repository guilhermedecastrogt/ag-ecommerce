import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users/presentation/controllers/users.controller';
import { CreateUserUseCase } from './users/application/use-cases/create-user.use-case';
import { FindAllUsersUseCase } from './users/application/use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from './users/application/use-cases/find-user-by-id.use-case';

describe('UsersServiceController', () => {
  let usersServiceController: UsersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindAllUsersUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: FindUserByIdUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    usersServiceController = app.get<UsersController>(UsersController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(usersServiceController).toBeDefined();
    });
  });
});
