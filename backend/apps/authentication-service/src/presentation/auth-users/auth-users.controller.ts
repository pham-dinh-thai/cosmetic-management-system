import { Body, Controller, Post } from '@nestjs/common';
import { CreateAuthUserUseCase } from '../../application/use-cases/create-auth-user/create-auth-user.use-case';
import { CreateAuthUserRequest } from './requests/create-auth-user.request';
import { LoginRequest } from './requests/login.request';
import { LoginResponse } from '../../application/use-cases/login/login.response';
import { LoginUseCase } from '../../application/use-cases/login/login.use-case';

@Controller('auth-users')
export class AuthUsersController {
  public constructor(
    private readonly createAuthUserUseCase: CreateAuthUserUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post()
  public async create(@Body() request: CreateAuthUserRequest): Promise<void> {
    await this.createAuthUserUseCase.execute(request);
  }

  @Post('/login')
  public async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return await this.loginUseCase.execute(request);
  }
}
