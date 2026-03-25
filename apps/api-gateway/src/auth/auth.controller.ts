import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import type { LoginUserDto } from './dtos/login-user.dto';
import type { RegisterUserDto } from './dtos/register-user.dto';
import type { TokenResponseDto } from './dtos/token-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() payload: RegisterUserDto): Promise<TokenResponseDto> {
    return firstValueFrom(
      this.authClient.send<TokenResponseDto>('auth.register', payload),
    );
  }

  @Post('login')
  async login(@Body() payload: LoginUserDto): Promise<TokenResponseDto> {
    return firstValueFrom(
      this.authClient.send<TokenResponseDto>('auth.login', payload),
    );
  }

  @Post('refresh')
  async refresh(
    @Body() payload: { refreshToken: string },
  ): Promise<TokenResponseDto> {
    return firstValueFrom(
      this.authClient.send<TokenResponseDto>('auth.refresh', payload),
    );
  }

  @Post('logout')
  async logout(@Body() payload: { refreshToken: string }): Promise<void> {
    return firstValueFrom(this.authClient.send<void>('auth.logout', payload));
  }
}
