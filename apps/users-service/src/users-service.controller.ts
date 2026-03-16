import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserUseCase } from './users/application/use-cases/create-user.use-case';
import { FindAllUsersUseCase } from './users/application/use-cases/find-all-users.use-case';
import { FindUserByIdUseCase } from './users/application/use-cases/find-user-by-id.use-case';

@Controller()
export class UsersServiceController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  @MessagePattern('users.create')
  create(@Payload() payload: { name: string; email: string }) {
    return this.createUserUseCase.execute(payload);
  }

  @MessagePattern('users.findAll')
  findAll() {
    return this.findAllUsersUseCase.execute();
  }

  @MessagePattern('users.findById')
  findById(@Payload() payload: { id: number }) {
    return this.findUserByIdUseCase.execute(payload.id);
  }
}
