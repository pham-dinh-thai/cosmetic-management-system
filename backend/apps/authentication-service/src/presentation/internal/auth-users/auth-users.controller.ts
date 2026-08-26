import { Body, Controller, Post } from '@nestjs/common';
import { CreateAuthUserUseCase } from 'apps/authentication-service/src/application/use-cases/create-auth-user/create-auth-user.use-case';
import { CreateAuthUserRequest } from './requests/create-auth-user.request';

@Controller('internal/auth-users')
export class InternalAuthUsersController {
  public constructor(
    private readonly createAuthUserUseCase: CreateAuthUserUseCase,
  ) {}

  @Post()
  public async create(@Body() request: CreateAuthUserRequest): Promise<void> {
    await this.createAuthUserUseCase.execute(request);
  }
}
