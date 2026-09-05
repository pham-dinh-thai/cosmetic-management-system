import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from 'apps/authentication-service/src/application/use-cases/login/login.use-case';
import { LoginResponse } from 'apps/authentication-service/src/application/use-cases/login/login.response';
import { RegisterUseCase } from 'apps/authentication-service/src/application/use-cases/register/register.use-case';
import { RegisterResponse } from 'apps/authentication-service/src/application/use-cases/register/register.response';
import { LoginRequest } from './requests/login.request';
import { RegisterRequest } from './requests/register.request';

@Controller('auth-users')
export class AuthUsersController {
  public constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
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
}
