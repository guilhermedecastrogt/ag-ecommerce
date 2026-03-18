import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.use-case';
import { LoginUserUseCase } from '../../application/use-cases/login-user.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { ValidateAccessTokenUseCase } from '../../application/use-cases/validate-access-token.use-case';
import { RegisterUserDto } from '../../application/dtos/register-user.dto';
import { LoginUserDto } from '../../application/dtos/login-user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUserUseCase,
    private readonly refreshToken: RefreshTokenUseCase,
    private readonly logoutUse: LogoutUseCase,
    private readonly validateAccessToken: ValidateAccessTokenUseCase,
  ) {}

  @MessagePattern('auth.register')
  async register(@Payload() data: RegisterUserDto) {
    return this.registerUser.execute(data);
  }

  @MessagePattern('auth.login')
  async login(@Payload() data: LoginUserDto) {
    return this.loginUser.execute(data);
  }

  @MessagePattern('auth.refresh')
  async refresh(@Payload() data: { refreshToken: string }) {
    return this.refreshToken.execute(data.refreshToken);
  }

  @MessagePattern('auth.logout')
  async logout(@Payload() data: { refreshToken: string }) {
    await this.logoutUse.execute(data.refreshToken);
    return { success: true };
  }

  @MessagePattern('auth.validate')
  async validate(@Payload() data: { accessToken: string }) {
    return this.validateAccessToken.execute(data.accessToken);
  }
}
