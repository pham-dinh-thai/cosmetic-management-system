import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from 'apps/authentication-service/src/application/use-cases/login/login.use-case';
import { LoginResponse } from 'apps/authentication-service/src/application/use-cases/login/login.response';
import { LoginRequest } from './requests/login.request';

@Controller('auth-users')
export class AuthUsersController {
  public constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('/login')
  public async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return await this.loginUseCase.execute(request);
  }
}
