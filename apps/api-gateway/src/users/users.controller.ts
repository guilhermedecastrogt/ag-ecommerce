import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type { CreateUserDto } from './dtos/create-user.dto';
import type { UserDto } from './dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() payload: CreateUserDto): Promise<UserDto> {
    return firstValueFrom(
      this.usersClient.send<UserDto, CreateUserDto>('users.create', payload),
    );
  }

  @Get()
  async findAll(): Promise<UserDto[]> {
    return firstValueFrom(
      this.usersClient.send<UserDto[], Record<string, never>>(
        'users.findAll',
        {},
      ),
    );
  }
}
