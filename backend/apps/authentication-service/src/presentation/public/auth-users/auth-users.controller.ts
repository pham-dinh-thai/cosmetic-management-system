import { Body, Controller, Headers, Post } from '@nestjs/common';
import { LoginUseCase } from 'apps/authentication-service/src/application/use-cases/login/login.use-case';
import { LoginResponse } from 'apps/authentication-service/src/application/use-cases/login/login.response';
import { RefreshTokenUseCase } from 'apps/authentication-service/src/application/use-cases/refresh-token/refresh-token.use-case';
import { RegisterUseCase } from 'apps/authentication-service/src/application/use-cases/register/register.use-case';
import { RegisterResponse } from 'apps/authentication-service/src/application/use-cases/register/register.response';
import { InvalidRefreshTokenException } from 'apps/authentication-service/src/domain/exceptions/invalid-refresh-token.exception';
import { LoginRequest } from './requests/login.request';
import { RegisterRequest } from './requests/register.request';

@Controller('auth-users')
export class AuthUsersController {
  public constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('/register')
  public async register(
    @Body() request: RegisterRequest,
  ): Promise<RegisterResponse> {
    return await this.registerUseCase.execute(request);
  }

  @Post('/login')
  public async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return await this.loginUseCase.execute(request);
  }

  @Post('/refresh-token')
  public async refreshToken(
    @Headers('authorization') authorization?: string,
  ): Promise<LoginResponse> {
    const [type, token] = authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new InvalidRefreshTokenException();
    }

    return await this.refreshTokenUseCase.execute(token);
  }
}
