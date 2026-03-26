import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import { sendWithContext } from '../common/helpers/send-with-context';
import { withResilience } from '../common/helpers/resilience';
import type { CreateUserDto } from './dtos/create-user.dto';
import type { UserDto } from './dtos/user.dto';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
    private readonly cls: ClsService,
  ) {}

  @Post()
  async create(@Body() payload: CreateUserDto): Promise<UserDto> {
    return firstValueFrom(
      withResilience(
        sendWithContext<UserDto>(
          this.usersClient,
          'users.create',
          payload,
          this.cls,
        ),
        { timeoutMs: 8000, retries: 1 },
      ),
    );
  }

  @Get()
  async findAll(): Promise<UserDto[]> {
    return firstValueFrom(
      withResilience(
        sendWithContext<UserDto[]>(
          this.usersClient,
          'users.findAll',
          {},
          this.cls,
        ),
      ),
    );
  }
}
