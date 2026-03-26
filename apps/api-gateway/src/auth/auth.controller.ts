import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ClsService } from 'nestjs-cls';
import { LoginUserDto } from './dtos/login-user.dto';
import { RegisterUserDto } from './dtos/register-user.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { sendWithContext } from '../common/helpers/send-with-context';
import { withResilience } from '../common/helpers/resilience';
import type { TokenResponseDto } from './dtos/token-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    private readonly cls: ClsService,
  ) {}

  @Post('register')
  async register(@Body() payload: RegisterUserDto): Promise<TokenResponseDto> {
    return firstValueFrom(
      withResilience(
        sendWithContext<TokenResponseDto>(
          this.authClient,
          'auth.register',
          payload,
          this.cls,
        ),
        { timeoutMs: 8000, retries: 1 },
      ),
    );
  }

  @Post('login')
  async login(@Body() payload: LoginUserDto): Promise<TokenResponseDto> {
    return firstValueFrom(
      withResilience(
        sendWithContext<TokenResponseDto>(
          this.authClient,
          'auth.login',
          payload,
          this.cls,
        ),
        { timeoutMs: 8000, retries: 1 },
      ),
    );
  }

  @Post('refresh')
  async refresh(@Body() payload: RefreshTokenDto): Promise<TokenResponseDto> {
    return firstValueFrom(
      withResilience(
        sendWithContext<TokenResponseDto>(
          this.authClient,
          'auth.refresh',
          payload,
          this.cls,
        ),
        { timeoutMs: 5000, retries: 1 },
      ),
    );
  }

  @Post('logout')
  async logout(@Body() payload: RefreshTokenDto): Promise<void> {
    return firstValueFrom(
      withResilience(
        sendWithContext<void>(
          this.authClient,
          'auth.logout',
          payload,
          this.cls,
        ),
        { timeoutMs: 5000, retries: 0 },
      ),
    );
  }
}
