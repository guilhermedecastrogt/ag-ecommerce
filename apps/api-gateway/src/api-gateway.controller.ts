import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

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
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
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

  @UseGuards(JwtAuthGuard)
  @Post('orders')
  async createOrder(@Body() payload: CreateOrderDto): Promise<OrderDto> {
    return firstValueFrom(
      this.ordersClient.send<OrderDto, CreateOrderDto>(
        'orders.create',
        payload,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders')
  async findOrders(): Promise<OrderDto[]> {
    return firstValueFrom(
      this.ordersClient.send<OrderDto[], Record<string, never>>(
        'orders.findAll',
        {},
      ),
    );
  }

  // --- Auth Endpoints ---

  @Post('auth/register')
  async registerUser(@Body() payload: any) {
    return firstValueFrom(this.authClient.send('auth.register', payload));
  }

  @Post('auth/login')
  async loginUser(@Body() payload: any) {
    return firstValueFrom(this.authClient.send('auth.login', payload));
  }

  @Post('auth/refresh')
  async refreshToken(@Body() payload: { refreshToken: string }) {
    return firstValueFrom(this.authClient.send('auth.refresh', payload));
  }

  @Post('auth/logout')
  async logoutUser(@Body() payload: { refreshToken: string }) {
    return firstValueFrom(this.authClient.send('auth.logout', payload));
  }
}
