import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

type CreateUserDto = {
  name: string;
  email: string;
};

type UserDto = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
};

type CreateOrderDto = {
  userId: number;
  total: number;
};

type OrderDto = {
  id: number;
  userId: number;
  total: number;
  createdAt: Date;
};

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    @Inject('ORDERS_SERVICE') private readonly ordersClient: ClientProxy,
  ) {}

  @Get()
  getHealth() {
    return { status: 'ok', service: 'api-gateway' };
  }

  @Post('users')
  async createUser(@Body() payload: CreateUserDto): Promise<UserDto> {
    return firstValueFrom(
      this.usersClient.send<UserDto, CreateUserDto>('users.create', payload),
    );
  }

  @Get('users')
  async findUsers(): Promise<UserDto[]> {
    return firstValueFrom(
      this.usersClient.send<UserDto[], Record<string, never>>(
        'users.findAll',
        {},
      ),
    );
  }

  @Post('orders')
  async createOrder(@Body() payload: CreateOrderDto): Promise<OrderDto> {
    return firstValueFrom(
      this.ordersClient.send<OrderDto, CreateOrderDto>(
        'orders.create',
        payload,
      ),
    );
  }

  @Get('orders')
  async findOrders(): Promise<OrderDto[]> {
    return firstValueFrom(
      this.ordersClient.send<OrderDto[], Record<string, never>>(
        'orders.findAll',
        {},
      ),
    );
  }
}
